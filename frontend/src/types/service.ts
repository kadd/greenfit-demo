export interface Service {
  title: string;
  description: string;
  image?: string; // Filename des hochgeladenen Bildes
}

export interface ServicesData {
  label: string;
  description: string;
  content: {
    [key: string]: Service;
  };
}

// Beispiel für die Struktur der Services-Daten
export const exampleServicesData: ServicesData = {
  label: "Unsere Dienstleistungen",
    description: "Entdecken Sie unsere vielfältigen Fitnessangebote.",
  content: {
    personalTraining: {
      title: "Personal Training",
      description: "Individuell abgestimmte Trainingsprogramme mit persönlichem Trainer.",
      image: "personal_training.jpg",
    },
    groupClasses: {
      title: "Gruppenkurse",
      description: "Vielfältige Kurse für alle Fitnesslevels in der Gruppe.",
      image: "group_classes.jpg",
    },
    nutritionConsulting: {
      title: "Ernährungsberatung",
      description: "Professionelle Beratung für eine gesunde und ausgewogene Ernährung.",
      image: "nutrition_consulting.jpg",
    },
  },
};