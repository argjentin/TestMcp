# MCP Gemini Design

**Gemini is your frontend developer.** For all UI/design work, use this MCP. Tool descriptions contain all necessary instructions.

## Before writing any UI code, ask yourself:

- Is it a NEW visual component (popup, card, section, etc.)? → `snippet_frontend` or `create_frontend`
- Is it a REDESIGN of an existing element? → `modify_frontend`
- Is it just text/logic, or a trivial change? → Do it yourself

## Critical rules:

1. **If UI already exists and you need to redesign/restyle it** → use `modify_frontend`, NOT snippet_frontend.

2. **Tasks can be mixed** (logic + UI). Mentally separate them. Do the logic yourself, delegate the UI to Gemini.

---

# Stack Technique

Cette application utilise:
- **React** avec **TypeScript** strict
- **Zustand** pour le state management global
- **TanStack Query** (React Query) pour le data fetching et le cache
- **React Router** pour la navigation
- **Three.js** pour tous les éléments 3D complexes (scènes, modèles, shaders, etc.)
- **GSAP** pour les animations (transitions, timelines, ScrollTrigger, etc.)

---

# Standards de Développement

## 1. TypeScript Strict

Tout composant, hook, ou fonction **DOIT** être typé correctement:

```typescript
// ✅ BON - Types explicites
interface UserCardProps {
  user: User;
  onSelect: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onSelect }) => { ... }

// ❌ MAUVAIS - any, types implicites, props non typées
const UserCard = ({ user, onSelect }: any) => { ... }
```

## 2. Organisation des Composants

Structure obligatoire pour chaque feature/page:

```
src/
├── features/
│   └── [feature-name]/
│       ├── components/      # Composants spécifiques à la feature
│       │   ├── FeatureCard.tsx
│       │   └── FeatureList.tsx
│       ├── hooks/           # Hooks custom de la feature
│       │   └── useFeatureData.ts
│       ├── stores/          # Stores Zustand de la feature
│       │   └── featureStore.ts
│       ├── types/           # Types TypeScript
│       │   └── index.ts
│       └── index.ts         # Export public de la feature
├── components/              # Composants réutilisables globaux
├── hooks/                   # Hooks globaux
├── stores/                  # Stores Zustand globaux
└── types/                   # Types globaux
```

## 3. Optimisation des Re-renders (CRITIQUE)

**Penser optimisation dès la première ligne de code.**

### Règles obligatoires:

```typescript
// ✅ React.memo pour les composants qui reçoivent des props stables
export const UserCard = React.memo<UserCardProps>(({ user, onSelect }) => {
  // ...
});

// ✅ useCallback pour les fonctions passées en props
const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
}, []);

// ✅ useMemo pour les calculs coûteux
const filteredUsers = useMemo(() =>
  users.filter(u => u.active),
  [users]
);

// ✅ Zustand: sélecteurs granulaires pour éviter les re-renders
const username = useUserStore((state) => state.user.name); // BON
const user = useUserStore((state) => state.user);          // ÉVITER si on n'a besoin que du name

// ✅ TanStack Query: staleTime approprié
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000, // 5 minutes - évite les refetch inutiles
});
```

### Checklist avant chaque composant:

- [ ] Props typées avec interface/type
- [ ] `React.memo` si le composant reçoit des props
- [ ] `useCallback` pour toutes les fonctions passées aux enfants
- [ ] `useMemo` pour les calculs/transformations de données
- [ ] Sélecteurs Zustand granulaires (ne sélectionner que ce qui est nécessaire)
- [ ] `staleTime` configuré sur les queries TanStack

## 4. Patterns Zustand

```typescript
// ✅ Store bien structuré
interface UserStore {
  // State
  user: User | null;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

## 5. Patterns TanStack Query

```typescript
// ✅ Hook custom pour encapsuler la query
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
  });
};

// ✅ Mutation avec invalidation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

---

# Philosophie

> "Premature optimization is the root of all evil" - FAUX dans notre contexte.
>
> **L'optimisation n'est pas prématurée si elle est intégrée dès le design.**
>
> Un `React.memo` coûte 0 effort à ajouter dès le départ. Le refactoring pour l'ajouter plus tard coûte 10x plus.
