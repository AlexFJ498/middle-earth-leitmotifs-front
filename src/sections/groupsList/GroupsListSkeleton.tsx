import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./GroupsList.module.scss";

export function GroupsListSkeleton() {
  const items = Array.from({ length: 14 });
  return (
    <div className={styles.gridContainer} role="status" aria-live="polite" aria-busy="true" aria-label="Loading groups">
      {items.map((_, i) => (
        <div key={i} className={styles.gridItem}>
          <div className={styles.card}>
            <div className={styles.titleBox}>
              <Skeleton height={28} width="75%" baseColor="rgba(255,255,255,0.08)" highlightColor="rgba(255,255,255,0.18)" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
