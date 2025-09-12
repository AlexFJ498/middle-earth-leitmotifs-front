import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './ThemesList.module.scss';

const PLACEHOLDER_GROUPS = 4;
const PLACEHOLDER_CATEGORIES_PER_GROUP = 2;
const PLACEHOLDER_CHIPS_PER_BLOCK = 6;

const groupIds = Array.from({ length: PLACEHOLDER_GROUPS }, (_, i) => `group-${i}`);
const categoryIds = Array.from({ length: PLACEHOLDER_CATEGORIES_PER_GROUP }, (_, i) => `cat-${i}`);
const chipIds = Array.from({ length: PLACEHOLDER_CHIPS_PER_BLOCK }, (_, i) => `chip-${i}`);

function ChipsSkeletonRow() {
  return (
    <div className={styles.themeChips}>
      {chipIds.map((id) => (
        <span key={id} className={styles.themeChip} style={{ padding: 0 }}>
          <Skeleton height={24} width={140} />
        </span>
      ))}
    </div>
  );
}

function CategoryBlockSkeleton({ index }: { index: number }) {
  return (
    <div style={{ marginTop: index === 0 ? 0 : '1rem' }}>
      <div style={{ marginBottom: '.3rem' }}>
        <Skeleton height={18} width={120} />
      </div>
      <ChipsSkeletonRow />
    </div>
  );
}

function GroupCardSkeleton() {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle} style={{ display: 'flex', gap: '0.5rem' }}>
        <Skeleton height={28} width={180} />
      </h2>
      <div className={styles.cardContent}>
        <ChipsSkeletonRow />
        {categoryIds.map((id, idx) => (
          <CategoryBlockSkeleton key={id} index={idx} />
        ))}
      </div>
    </div>
  );
}

export function WidgetsSkeleton() {
  return (
    <SkeletonTheme baseColor="#3a2c1a" highlightColor="#5a4528" borderRadius={12} duration={1.2}>
      <div className={styles.container}>
        {groupIds.map((id) => (
          <GroupCardSkeleton key={id} />
        ))}
      </div>
    </SkeletonTheme>
  );
}
