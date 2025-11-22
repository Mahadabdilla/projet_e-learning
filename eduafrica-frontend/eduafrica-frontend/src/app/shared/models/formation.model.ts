export enum FormationCategory {
  DEVELOPPEMENT = 'DEVELOPPEMENT',
  MARKETING = 'MARKETING',
  TECHNOLOGIE = 'TECHNOLOGIE',
  BUSINESS = 'BUSINESS',
  SECURITE = 'SECURITE',
  AGRICULTURE = 'AGRICULTURE',
  DESIGN = 'DESIGN',
  DATA_SCIENCE = 'DATA_SCIENCE',
  MOBILE = 'MOBILE',
  CLOUD = 'CLOUD'
}

export enum FormationLevel {
  DEBUTANT = 'DEBUTANT',
  INTERMEDIAIRE = 'INTERMEDIAIRE',
  AVANCE = 'AVANCE'
}

export interface Formation {
  id: number;
  title: string;
  description: string;
  programme?: string;
  category: FormationCategory;
  level: FormationLevel;
  price: number;
  isFree: boolean;
  duration: number;
  formateur: {
    id: number;
    firstName: string;
    lastName: string;
  };
  tags: string[];
  averageRating: number;
  nbStudents: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormationFilters {
  category?: FormationCategory;
  level?: FormationLevel;
  isFree?: boolean;
  keyword?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
