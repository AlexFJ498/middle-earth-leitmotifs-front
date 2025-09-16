import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './ThemeDetail.module.scss';

export function WidgetsSkeleton() {
  return (
    <SkeletonTheme baseColor="#3a2c1a" highlightColor="#5a4528" borderRadius={12} duration={1.15}>
      <div className={styles.detailWrapper} aria-label="Loading theme detail">
        <div style={{ marginBottom: '1.5rem' }}>
          <Skeleton height={34} width={110} style={{ borderRadius: 999 }} />
        </div>
        <h1 className={styles.title} style={{ display: 'flex', gap: '0.75rem' }}>
          <Skeleton height={46} width={420} />
        </h1>
        <div className={styles.metaBlock}>
          <p className={styles.metaItem}>
            <Skeleton height={20} width={340} />
          </p>
          <p className={styles.metaItem}>
            <Skeleton height={20} width={280} />
          </p>
          <p className={styles.metaItem} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Skeleton height={20} width={200} />
            <Skeleton height={22} width={90} style={{ borderRadius: 999 }} />
          </p>
        </div>
      </div>
    </SkeletonTheme>
  );
}
