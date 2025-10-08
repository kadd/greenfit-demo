export interface Service {
  id: string;
  isPage: boolean;
  createdAt: string; // ISO Datum
  updatedAt: string; // ISO Datum
  title: string;
  description: string;
  image?: string; // Filename des hochgeladenen Bildes
}

export interface ServiceData {
  label: string;
  description: string;
  content: {
    [key: string]: Service;
  };
}

// Beispiel für die Struktur der Services-Daten
export const exampleServicesData: ServiceData = {
  label: "Unsere Dienstleistungen",
    description: "Entdecken Sie unsere vielfältigen Fitnessangebote.",
  content: {
    personalTraining: {
      id: "services-1",
      title: "Personal Training",
      description: "Individuell abgestimmte Trainingsprogramme mit persönlichem Trainer.",
      image: "personal_training.jpg",
    },
    groupClasses: {
      id: "services-2",
      title: "Gruppenkurse",
      description: "Vielfältige Kurse für alle Fitnesslevels in der Gruppe.",
      image: "group_classes.jpg",
    },
    nutritionConsulting: {
      id: "services-3",
      title: "Ernährungsberatung",
      description: "Professionelle Beratung für eine gesunde und ausgewogene Ernährung.",
      image: "nutrition_consulting.jpg",
    },
  },
};