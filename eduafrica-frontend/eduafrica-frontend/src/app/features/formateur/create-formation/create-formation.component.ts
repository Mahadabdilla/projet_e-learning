import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormationService } from '../../../core/services/formation.service';
import { Formation, FormationCategory, FormationLevel } from '../../../shared/models/formation.model';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { FileUpload } from '../../../shared/models/file-upload.model';

@Component({
  selector: 'app-create-formation',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent],
  templateUrl: './create-formation.component.html',
  styleUrls: ['./create-formation.component.css']
})
export class CreateFormationComponent implements OnInit {
  formation: Partial<Formation> = {
    title: '',
    description: '',
    programme: '',
    category: FormationCategory.DEVELOPPEMENT,
    level: FormationLevel.DEBUTANT,
    price: 0,
    isFree: false,
    duration: 0,
    tags: [],
    imageUrl: undefined
  };

  isEditMode = false;
  formationId: number | null = null;
  isLoading = false;
  error: string | null = null;

  categories = Object.values(FormationCategory);
  levels = Object.values(FormationLevel);

  newTag = '';

  uploadedImage: FileUpload | null = null;

  constructor(
    private formationService: FormationService,
    private router: Router,
    private route: ActivatedRoute,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.formationId = +id;
      this.loadFormation();
    }
  }

  loadFormation() {
    if (!this.formationId) return;
    
    this.isLoading = true;
    this.formationService.getFormationById(this.formationId).subscribe({
      next: (formation) => {
        this.formation = {
          title: formation.title,
          description: formation.description,
          programme: formation.programme || '',
          category: formation.category,
          level: formation.level,
          price: formation.price,
          isFree: formation.isFree,
          duration: formation.duration,
          tags: formation.tags || [],
          imageUrl: formation.imageUrl
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de la formation';
        this.isLoading = false;
      }
    });
  }

  addTag() {
    if (this.newTag.trim() && !this.formation.tags?.includes(this.newTag.trim())) {
      if (!this.formation.tags) {
        this.formation.tags = [];
      }
      this.formation.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }

  removeTag(tag: string) {
    if (this.formation.tags) {
      this.formation.tags = this.formation.tags.filter(t => t !== tag);
    }
  }

  onImageUploaded(fileUpload: FileUpload) {
    this.uploadedImage = fileUpload;
    // Optionnel : mettre à jour aussi l'URL pour affichage
    this.formation.imageUrl = this.fileUploadService.getFileUrl(fileUpload.id);
  }

  onUploadError(error: string) {
    this.error = error;
  }

  onFreeChange() {
    if (this.formation.isFree) {
      this.formation.price = 0;
    }
  }

  onSubmit(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log('onSubmit appelé');
    console.log('Formation data:', this.formation);
    
    if (!this.validateForm()) {
      console.log('Validation échouée:', this.error);
      return;
    }

    console.log('Validation réussie, envoi des données...');
    this.isLoading = true;
    this.error = null;

    // Préparer les données pour l'envoi
    const formationData: any = {
      title: this.formation.title?.trim(),
      description: this.formation.description?.trim(),
      category: this.formation.category,
      level: this.formation.level,
      duration: this.formation.duration
    };

    // Ajouter les champs optionnels
    if (this.formation.programme) {
      formationData.programme = this.formation.programme.trim();
    }
    
    if (this.formation.isFree) {
      formationData.isFree = true;
      formationData.price = 0;
    } else {
      formationData.isFree = false;
      formationData.price = this.formation.price || 0;
    }
    
    if (this.formation.tags && this.formation.tags.length > 0) {
      formationData.tags = this.formation.tags;
    }
    
    // Utiliser l'image uploadée si disponible, sinon l'URL
    if (this.uploadedImage) {
      formationData.imageUrl = this.fileUploadService.getFileUrl(this.uploadedImage.id);
    } else if (this.formation.imageUrl && this.formation.imageUrl.trim()) {
      formationData.imageUrl = this.formation.imageUrl.trim();
    }

    console.log('Données à envoyer:', formationData);

    if (this.isEditMode && this.formationId) {
      this.formationService.updateFormation(this.formationId, formationData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/formateur']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          this.error = err.error?.message || err.message || 'Erreur lors de la mise à jour de la formation. Veuillez vérifier vos données.';
          this.isLoading = false;
        }
      });
    } else {
      this.formationService.createFormation(formationData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/formateur']);
        },
        error: (err) => {
          console.error('Erreur lors de la création:', err);
          if (err.status === 401 || err.status === 403) {
            this.error = 'Vous devez être connecté en tant que formateur pour créer une formation.';
          } else if (err.status === 400) {
            this.error = err.error?.message || 'Données invalides. Veuillez vérifier tous les champs obligatoires.';
          } else {
            this.error = err.error?.message || err.message || 'Erreur lors de la création de la formation. Veuillez réessayer.';
          }
          this.isLoading = false;
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.formation.title?.trim()) {
      this.error = 'Le titre est obligatoire';
      return false;
    }
    if (this.formation.title.trim().length > 500) {
      this.error = 'Le titre ne doit pas dépasser 500 caractères';
      return false;
    }
    if (!this.formation.description?.trim()) {
      this.error = 'La description est obligatoire';
      return false;
    }
    if (!this.formation.category) {
      this.error = 'La catégorie est obligatoire';
      return false;
    }
    if (!this.formation.level) {
      this.error = 'Le niveau est obligatoire';
      return false;
    }
    if (!this.formation.duration || this.formation.duration <= 0) {
      this.error = 'La durée doit être supérieure à 0';
      return false;
    }
    if (!this.formation.isFree && (!this.formation.price || this.formation.price < 0)) {
      this.error = 'Le prix doit être supérieur ou égal à 0';
      return false;
    }
    if (this.formation.imageUrl && this.formation.imageUrl.trim().length > 1000) {
      this.error = 'L\'URL de l\'image ne doit pas dépasser 1000 caractères';
      return false;
    }
    return true;
  }

  cancel() {
    this.router.navigate(['/dashboard/formateur']);
  }
}

