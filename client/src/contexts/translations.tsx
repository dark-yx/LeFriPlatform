import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface Translations {
  [key: string]: {
    [lang: string]: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.dashboard': { es: 'Panel Principal', en: 'Dashboard', fr: 'Tableau de Bord' },
  'nav.consultation': { es: 'Consulta', en: 'Consultation', fr: 'Consultation' },
  'nav.processes': { es: 'Procesos', en: 'Processes', fr: 'Processus' },
  'nav.emergency': { es: 'Emergencia', en: 'Emergency', fr: 'Urgence' },
  'nav.profile': { es: 'Mi Perfil', en: 'My Profile', fr: 'Mon Profil' },
  'nav.settings': { es: 'Configuración', en: 'Settings', fr: 'Paramètres' },
  'nav.logout': { es: 'Cerrar Sesión', en: 'Logout', fr: 'Déconnexion' },

  // Dashboard
  'dashboard.title': { es: 'Bienvenido a LeFriAI', en: 'Welcome to LeFriAI', fr: 'Bienvenue sur LeFriAI' },
  'dashboard.subtitle': { es: 'Tu asistente legal inteligente para Ecuador', en: 'Your intelligent legal assistant for Ecuador', fr: 'Votre assistant juridique intelligent pour l\'Équateur' },
  'dashboard.consultation.title': { es: 'Modo Consulta', en: 'Consultation Mode', fr: 'Mode Consultation' },
  'dashboard.consultation.desc': { es: 'Realiza consultas legales y obtén respuestas contextualizadas por país usando IA avanzada.', en: 'Make legal consultations and get country-contextualized responses using advanced AI.', fr: 'Effectuez des consultations juridiques et obtenez des réponses contextualisées par pays en utilisant l\'IA avancée.' },
  'dashboard.processes.title': { es: 'Modo Proceso', en: 'Process Mode', fr: 'Mode Processus' },
  'dashboard.processes.desc': { es: 'Guía paso a paso para procesos legales comunes como divorcios, contratos y demandas.', en: 'Step-by-step guide for common legal processes like divorces, contracts and lawsuits.', fr: 'Guide étape par étape pour les processus juridiques courants comme les divorces, contrats et poursuites.' },
  'dashboard.emergency.title': { es: 'Modo Emergencia', en: 'Emergency Mode', fr: 'Mode Urgence' },
  'dashboard.emergency.desc': { es: 'Sistema de alertas automáticas vía WhatsApp a tus contactos de emergencia.', en: 'Automatic WhatsApp alert system to your emergency contacts.', fr: 'Système d\'alertes automatiques WhatsApp vers vos contacts d\'urgence.' },

  // Processes
  'processes.title': { es: 'Procesos Legales', en: 'Legal Processes', fr: 'Processus Juridiques' },
  'processes.subtitle': { es: 'Gestiona tus procesos legales y haz seguimiento a cada paso', en: 'Manage your legal processes and track every step', fr: 'Gérez vos processus juridiques et suivez chaque étape' },
  'processes.new': { es: 'Nuevo Proceso', en: 'New Process', fr: 'Nouveau Processus' },
  'processes.create.title': { es: 'Crear Nuevo Proceso', en: 'Create New Process', fr: 'Créer un Nouveau Processus' },
  'processes.create.desc': { es: 'Ingresa los detalles básicos de tu proceso legal', en: 'Enter the basic details of your legal process', fr: 'Entrez les détails de base de votre processus juridique' },
  'processes.title.label': { es: 'Título del Proceso', en: 'Process Title', fr: 'Titre du Processus' },
  'processes.type.label': { es: 'Tipo de Proceso', en: 'Process Type', fr: 'Type de Processus' },
  'processes.description.label': { es: 'Descripción', en: 'Description', fr: 'Description' },
  'processes.priority.label': { es: 'Prioridad', en: 'Priority', fr: 'Priorité' },
  'processes.deadline.label': { es: 'Fecha Límite (Opcional)', en: 'Deadline (Optional)', fr: 'Date Limite (Optionnel)' },
  'processes.status.completed': { es: 'Completado', en: 'Completed', fr: 'Terminé' },
  'processes.status.in_progress': { es: 'En Progreso', en: 'In Progress', fr: 'En Cours' },
  'processes.status.pending': { es: 'Pendiente', en: 'Pending', fr: 'En Attente' },
  'processes.priority.high': { es: 'Alta', en: 'High', fr: 'Haute' },
  'processes.priority.medium': { es: 'Media', en: 'Medium', fr: 'Moyenne' },
  'processes.priority.low': { es: 'Baja', en: 'Low', fr: 'Basse' },

  // Process Detail
  'process.case_info': { es: 'Información del Caso', en: 'Case Information', fr: 'Informations du Cas' },
  'process.case_number': { es: 'Número de Caso', en: 'Case Number', fr: 'Numéro de Cas' },
  'process.court': { es: 'Tribunal', en: 'Court', fr: 'Tribunal' },
  'process.judge': { es: 'Juez', en: 'Judge', fr: 'Juge' },
  'process.opposing_party': { es: 'Parte Contraria', en: 'Opposing Party', fr: 'Partie Adverse' },
  'process.amount': { es: 'Monto en Disputa', en: 'Amount in Dispute', fr: 'Montant en Litige' },
  'process.deadline': { es: 'Fecha Límite', en: 'Deadline', fr: 'Date Limite' },
  'process.legal_basis': { es: 'Base Legal', en: 'Legal Basis', fr: 'Base Légale' },
  'process.constitutional_articles': { es: 'Artículos Constitucionales', en: 'Constitutional Articles', fr: 'Articles Constitutionnels' },
  'process.required_documents': { es: 'Documentos Requeridos', en: 'Required Documents', fr: 'Documents Requis' },
  'process.steps': { es: 'Pasos del Proceso', en: 'Process Steps', fr: 'Étapes du Processus' },
  'process.progress': { es: 'Progreso del Proceso', en: 'Process Progress', fr: 'Progrès du Processus' },
  'process.chat_ai': { es: 'Chat IA', en: 'AI Chat', fr: 'Chat IA' },
  'process.generate_document': { es: 'Generar Documento', en: 'Generate Document', fr: 'Générer Document' },
  'process.generating': { es: 'Generando...', en: 'Generating...', fr: 'Génération...' },

  // Common
  'common.create': { es: 'Crear', en: 'Create', fr: 'Créer' },
  'common.cancel': { es: 'Cancelar', en: 'Cancel', fr: 'Annuler' },
  'common.save': { es: 'Guardar', en: 'Save', fr: 'Sauvegarder' },
  'common.edit': { es: 'Editar', en: 'Edit', fr: 'Modifier' },
  'common.delete': { es: 'Eliminar', en: 'Delete', fr: 'Supprimer' },
  'common.view_details': { es: 'Ver Detalles', en: 'View Details', fr: 'Voir Détails' },
  'common.back': { es: 'Volver', en: 'Back', fr: 'Retour' },
  'common.loading': { es: 'Cargando...', en: 'Loading...', fr: 'Chargement...' },
  'common.error': { es: 'Error', en: 'Error', fr: 'Erreur' },
  'common.success': { es: 'Éxito', en: 'Success', fr: 'Succès' },

  // Profile
  'profile.title': { es: 'Mi Perfil', en: 'My Profile', fr: 'Mon Profil' },
  'profile.personal_info': { es: 'Información Personal', en: 'Personal Information', fr: 'Informations Personnelles' },
  'profile.name': { es: 'Nombre', en: 'Name', fr: 'Nom' },
  'profile.email': { es: 'Correo Electrónico', en: 'Email', fr: 'Email' },
  'profile.country': { es: 'País', en: 'Country', fr: 'Pays' },
  'profile.language': { es: 'Idioma', en: 'Language', fr: 'Langue' },
  'profile.theme': { es: 'Tema', en: 'Theme', fr: 'Thème' },
  'profile.theme.light': { es: 'Claro', en: 'Light', fr: 'Clair' },
  'profile.theme.dark': { es: 'Oscuro', en: 'Dark', fr: 'Sombre' },
  'profile.save_changes': { es: 'Guardar Cambios', en: 'Save Changes', fr: 'Sauvegarder les Modifications' },
};

const TranslationContext = createContext<{
  t: (key: string) => string;
  language: string;
}>({
  t: (key: string) => key,
  language: 'es',
});

export function TranslationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const language = user?.language || 'es';

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation['es'] || key;
  };

  return (
    <TranslationContext.Provider value={{ t, language }}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => useContext(TranslationContext);