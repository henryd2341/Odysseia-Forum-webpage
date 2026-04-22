import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface OnboardingStep {
  id: string;
  target?: string; // CSS Selector
  title: string;
  content: string;
  emotion?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;
}

export interface OnboardingTutorial {
  id: string;
  steps: OnboardingStep[];
}

interface OnboardingState {
  activeTutorial: OnboardingTutorial | null;
  stepIndex: number;
  completedTutorialIds: string[];
  
  startTutorial: (tutorial: OnboardingTutorial) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeTutorial: () => void;
  skipTutorial: () => void;
  isTutorialCompleted: (id: string) => boolean;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      activeTutorial: null,
      stepIndex: 0,
      completedTutorialIds: [],

      startTutorial: (tutorial) => {
        set({ activeTutorial: tutorial, stepIndex: 0 });
      },

      nextStep: () => {
        const { activeTutorial, stepIndex } = get();
        
        const execute = () => {
          if (activeTutorial && stepIndex < activeTutorial.steps.length - 1) {
            const nextIndex = stepIndex + 1;
            set({ stepIndex: nextIndex });
            activeTutorial.steps[nextIndex].action?.();
          } else {
            get().completeTutorial();
          }
        };

        if (document.startViewTransition) {
          document.startViewTransition(execute);
        } else {
          execute();
        }
      },

      prevStep: () => {
        const { stepIndex } = get();
        if (stepIndex > 0) {
          const execute = () => set({ stepIndex: stepIndex - 1 });
          if (document.startViewTransition) {
            document.startViewTransition(execute);
          } else {
            execute();
          }
        }
      },

      completeTutorial: () => {
        const { activeTutorial, completedTutorialIds } = get();
        if (activeTutorial) {
          set({
            completedTutorialIds: [...new Set([...completedTutorialIds, activeTutorial.id])],
            activeTutorial: null,
            stepIndex: 0,
          });
        }
      },

      skipTutorial: () => {
        set({ activeTutorial: null, stepIndex: 0 });
      },

      isTutorialCompleted: (id) => {
        return get().completedTutorialIds.includes(id);
      },
    }),
    {
      name: 'odysseia_onboarding_state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ completedTutorialIds: state.completedTutorialIds }),
    }
  )
);
