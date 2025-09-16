import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import styles from './Layout.module.scss';
import TopBarProgressByLocation from "./TopBarProgressByLocation";

export function Layout() {
	return (
		<>
			<TopBarProgressByLocation />
			<header>
				<div className={styles.headerContainer}>
					<h1 className={styles.headerTitle}>Themes List</h1>
				</div>
			</header>
			<ErrorBoundary>
				<Outlet />
			</ErrorBoundary>
		</>
	);
}
