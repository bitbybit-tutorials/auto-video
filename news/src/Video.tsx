import {Composition} from 'remotion';
import {News} from './News';

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="News"
				component={News}
				durationInFrames={2000}
				fps={30}
				width={1080}
				height={1350}
			/>
		</>
	);
};
