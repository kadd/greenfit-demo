// backend/src/services/defaultGenerator.js

const fs = require('fs').promises;
const path = require('path');

class DefaultGenerator {
  
  static generateBlog() {
    return {
      id: "blog",
      title: "Blog",
      isPage: true,
      description: "Beschreibung des Blogs",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: "post-1",
          title: "Willkommen in unserem Blog",
          excerpt: "Dies ist unser erster Blog Post.",
          content: "Vollständiger Inhalt des ersten Posts...",
          author: "GreenFit Team",
          date: new Date().toISOString().split('T')[0],
          tags: ["Willkommen", "News"],
          published: true,
          featuredImage: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "post-2",
          title: "Fitness Tipps für Einsteiger",
          excerpt: "Grundlegende Tipps für Einsteiger.",
          content: "Vollständiger Inhalt des zweiten Posts...",
          author: "GreenFit Team",
          date: new Date().toISOString().split('T')[0],
          tags: ["Fitness", "Tipps"],
          published: true,
          featuredImage: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
            id: "post-3",
            title: "Ernährungsrichtlinien für Sportler",
            excerpt: "Wichtige Ernährungstipps für Sportler.",
            content: "Vollständiger Inhalt des dritten Posts...",
            author: "GreenFit Team",
            date: new Date().toISOString().split('T')[0],
            tags: ["Ernährung", "Sport"],
            published: true,
            featuredImage: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: "post-4",
            title: "Die besten Workout-Routinen",
            excerpt: "Effektive Workout-Routinen für jedes Fitnesslevel.",
            content: "Vollständiger Inhalt des vierten Posts...",
            author: "GreenFit Team",
            date: new Date().toISOString().split('T')[0],
            tags: ["Workout", "Fitness"],
            published: true,
            featuredImage: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
      ]
    };
  }

  static generateFAQ() {
    return {
      id: "faq",
      title: "Häufig gestellte Fragen",
      isPage: true,
      description: "Antworten auf wichtige Fragen",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: "faq-1",
          question: "Wie kann ich mich anmelden?",
          answer: "Sie können sich über unser Online-Formular anmelden.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "faq-2",
          question: "Welche Zahlungsmethoden akzeptieren Sie?",
          answer: "Wir akzeptieren Kreditkarten, PayPal und Banküberweisung.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "faq-3",
          question: "Kann ich mein Abo pausieren?",
          answer: "Ja, Sie können Ihr Abo für bis zu 3 Monate pausieren.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "faq-4",
          question: "Wie kann ich meinen Account löschen?",
          answer: "Bitte kontaktieren Sie unseren Support, um Ihren Account zu löschen.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "faq-5",
          question: "Gibt es eine Testphase?",
          answer: "Ja, wir bieten eine 14-tägige Testphase an.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "faq-6",
          question: "Wie kann ich mein Passwort zurücksetzen?",
          answer: "Sie können Ihr Passwort über die 'Passwort vergessen?'-Funktion zurücksetzen.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  }

  static generatePrivacy() {
    return {
      id: "privacy",
      title: "Datenschutzerklärung",
      isPage: true,
      description: "Informationen zum Datenschutz",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: "section-1",
          heading: "1. Allgemeine Informationen",
          text: "Diese Datenschutzerklärung informiert über die Verarbeitung personenbezogener Daten.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "section-2",
          heading: "2. Rechte der betroffenen Personen",
          text: "Sie haben das Recht, Auskunft über die Verarbeitung Ihrer Daten zu erhalten.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "section-3",
          heading: "3. Datenverarbeitung im Auftrag",
          text: "Wir verarbeiten Ihre Daten nur im Rahmen der gesetzlichen Vorgaben.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "section-4",
          heading: "4. Datensicherheit",
          text: "Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten zu schützen.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "section-5",
          heading: "5. Änderungen der Datenschutzerklärung",
          text: "Wir behalten uns vor, diese Datenschutzerklärung anzupassen.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
  }

  static generateTerms() {
    return {
      id: "terms",
      title: "Allgemeine Geschäftsbedingungen",
      isPage: true,
      description: "Unsere Geschäftsbedingungen",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: "section-1",
          heading: "1. Geltungsbereich",
          text: "Diese AGB gelten für alle Verträge zwischen uns und unseren Kunden.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "section-2",
          heading: "2. Vertragsschluss",
          text: "Der Vertrag kommt durch Ihre Bestellung und unsere Auftragsbestätigung zustande.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "section-3",
          heading: "3. Zahlungsbedingungen",
          text: "Die Zahlung erfolgt gemäß den vereinbarten Zahlungsbedingungen.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
            id: "section-4",
            heading: "4. Haftung",
            text: "Wir haften nur für Schäden, die auf vorsätzlicher oder grob fahrlässiger Pflichtverletzung beruhen.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: "section-5",
            heading: "5. Schlussbestimmungen",
            text: "Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
      ]
    };
  }

  // Alle Defaults generieren
  static async generateAllDefaults(dataDir) {
    const defaults = {
      'blog.json': this.generateBlog(),
      'faq.json': this.generateFAQ(),
      'privacy.json': this.generatePrivacy(),
      'terms.json': this.generateTerms()
    };

    for (const [filename, data] of Object.entries(defaults)) {
      const filePath = path.join(dataDir, filename);

      // Ordner erstellen, falls nicht existent
      await fs.mkdir(dataDir, { recursive: true });
      
      // Nur erstellen wenn Datei nicht existiert
      try {
        await fs.access(filePath);
        console.log(`${filename} already exists, skipping...`);
      } catch {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log(`Created default ${filename}`);
      }
    }
  }
}

module.exports = DefaultGenerator;