import { User, UserRole, Mobility, MobilityStatus, ChecklistItem, ChecklistItemStatus, JournalEntry, ForumPost, Testimonial } from '../types';

// Initial Mock Data

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alice Martin',
  email: 'alice.martin@eliseea.eu',
  role: UserRole.STUDENT,
  avatarUrl: 'https://picsum.photos/100/100',
};

export const TEACHER_USER: User = {
  id: 'u2',
  name: 'M. Dupont',
  email: 'prof.dupont@eliseea.eu',
  role: UserRole.TEACHER,
  avatarUrl: 'https://picsum.photos/101/101',
};

export const ADMIN_USER: User = {
  id: 'u3',
  name: 'Admin ELISEEA',
  email: 'admin@eliseea.eu',
  role: UserRole.ADMIN,
  avatarUrl: 'https://picsum.photos/102/102',
};

export const MOCK_MOBILITY: Mobility = {
  id: 'm1',
  userId: 'u1',
  destination: 'Séville, Espagne',
  countryCode: 'ES',
  startDate: '2024-05-01',
  endDate: '2024-06-30',
  type: 'STAGE',
  status: MobilityStatus.PREPARATION,
  hostOrganization: 'Jardines de Sevilla',
};

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 'c1', label: 'Contrat Pédagogique (Learning Agreement)', status: ChecklistItemStatus.VALIDATED, deadline: '2024-03-01', requiresUpload: true, description: 'Faire signer par le tuteur et l\'établissement.' },
  { id: 'c2', label: 'Convention de Stage', status: ChecklistItemStatus.DONE, deadline: '2024-03-15', requiresUpload: true, description: 'Version trilingue obligatoire.', uploadedFile: 'convention_alice.pdf' },
  { id: 'c3', label: 'Carte Européenne d\'Assurance Maladie', status: ChecklistItemStatus.TODO, deadline: '2024-04-01', requiresUpload: true, description: 'Demander sur le site Ameli.' },
  { id: 'c4', label: 'Test Linguistique OLS (Avant départ)', status: ChecklistItemStatus.IN_PROGRESS, deadline: '2024-04-10', requiresUpload: false, description: 'Passer le test de niveau sur la plateforme EU.' },
  { id: 'c5', label: 'Recherche de logement', status: ChecklistItemStatus.IN_PROGRESS, deadline: '2024-04-15', requiresUpload: false, description: 'Confirmer l\'adresse à l\'équipe pédagogique.' },
];

const INITIAL_JOURNAL: JournalEntry[] = [
  { id: 'j1', mobilityId: 'm1', date: '2024-05-02', content: "Premier jour ! L'accueil était super. J'ai rencontré mon tuteur, Carlos. Il parle un peu français.", activities: "Visite de l'entreprise, présentation de l'équipe.", skills: "Adaptabilité, Compréhension orale (Espagnol)", mood: 5, photos: ['https://picsum.photos/300/200'] },
  { id: 'j2', mobilityId: 'm1', date: '2024-05-05', content: "C'est un peu dur de comprendre l'accent andalou, mais je m'accroche. J'ai commencé à travailler sur les parterres de fleurs.", activities: "Jardinage, Entretien des outils.", skills: "Techniques horticoles, Autonomie", mood: 3 },
];

const INITIAL_FORUM: ForumPost[] = [
  { id: 'f1', authorId: 'u5', authorName: 'Lucas B.', title: 'Logement à Dublin : des conseils ?', content: 'Je pars en septembre et je galère à trouver une coloc.', category: 'Irlande', date: '2023-10-12', likes: 12, replies: 4 },
  { id: 'f2', authorId: 'u6', authorName: 'Sarah L.', title: 'Comment remplir le Learning Agreement ?', content: 'La partie B me pose problème...', category: 'Administratif', date: '2023-11-05', likes: 5, replies: 2 },
];

// Service Methods (Simulating Async Calls)

export const getMobility = async (userId: string): Promise<Mobility | null> => {
  // Mock: always return the single mobility for demo
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_MOBILITY), 300));
};

export const getChecklist = async (mobilityId: string): Promise<ChecklistItem[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(INITIAL_CHECKLIST), 300));
};

export const updateChecklistItem = async (itemId: string, status: ChecklistItemStatus): Promise<void> => {
  const item = INITIAL_CHECKLIST.find(i => i.id === itemId);
  if (item) item.status = status;
};

export const getJournalEntries = async (mobilityId: string): Promise<JournalEntry[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(INITIAL_JOURNAL), 300));
};

export const addJournalEntry = async (entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> => {
  const newEntry = { ...entry, id: `j${Date.now()}` };
  INITIAL_JOURNAL.unshift(newEntry);
  return newEntry;
};

export const getForumPosts = async (): Promise<ForumPost[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(INITIAL_FORUM), 300));
};

// Simple in-memory storage for testimonials for the session
let testimonials: Testimonial[] = [];

export const saveTestimonial = async (testimonial: Testimonial) => {
    testimonials.push(testimonial);
    return testimonial;
};

export const getTestimonials = async () => {
    return testimonials;
}