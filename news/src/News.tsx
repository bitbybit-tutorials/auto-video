import {useEffect, useState} from 'react';
import {
	interpolate,
	Sequence,
	useCurrentFrame,
	continueRender,
	delayRender,
} from 'remotion';

type TArticle = {
	title?: string;
	description?: string;
	date?: string;
	image?: string | null;
};

type TNews = {
	title?: string;
	image?: string;
	articles: TArticle[];
};

const Article = ({title, description, date, image}: TArticle) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, 40], [0, 1], {
		extrapolateRight: 'clamp',
	});
	const scale = interpolate(frame, [0, 20], [0.9, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				flex: 1,
				textAlign: 'center',
				opacity,
				transform: `scale(${scale})`,
				padding: '0 2.5rem',
				position: 'absolute',
				top: '15rem',
				left: 0,
			}}
		>
			{date && (
				<p
					style={{
						fontSize: '2.8rem',
						marginLeft: '0.5rem',
						marginBottom: '1rem',
						marginTop: '3rem',
						color: 'grey',
						textAlign: 'left',
					}}
				>
					{new Date(date).toUTCString()}
				</p>
			)}
			<h1 style={{fontSize: '4.5rem', marginTop: 0}}>{title}</h1>
			<div
				style={{
					display: 'flex',
					alignItems: 'flex-start',
					padding: '0 1rem',
				}}
			>
				{image && (
					<img
						width={200}
						height={200}
						src={image}
						alt={title}
						style={{marginRight: '2rem'}}
					/>
				)}
				<h4 style={{fontSize: '2.8rem', margin: 0, textAlign: 'left'}}>
					{description}
				</h4>
			</div>
		</div>
	);
};

export const News = () => {
	const [data, setData] = useState<TNews | null>(null);
	const [handle] = useState(() => delayRender());
	const frame = useCurrentFrame();

	const opacity = interpolate(frame, [0, 40], [0, 1], {
		extrapolateRight: 'clamp',
	});
	const scale = interpolate(frame, [0, 20], [0.9, 1], {
		extrapolateRight: 'clamp',
	});

	const fetchData = async () => {
		const proxy = 'https://cors-anywhere.herokuapp.com/';
		const skyRss = 'https://feeds.skynews.com/feeds/rss/home.xml';

		let dataArr: TNews = {title: '', image: '', articles: []};
		fetch(`${proxy}${skyRss}`)
			.then((response) => response.text())
			.then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
			.then((data) => {
				const channelTitle = data.querySelector('title')?.innerHTML;
				const channelImage = data
					.querySelector('image')
					?.querySelector('url')?.innerHTML;
				dataArr = {
					...dataArr,
					title: channelTitle,
					image: channelImage,
				};

				const items = data.querySelectorAll('item');
				items.forEach((el) => {
					const article = {
						title: el.querySelector('title')?.innerHTML,
						description: el.querySelector('description')?.innerHTML,
						date: el.querySelector('pubDate')?.innerHTML,
						image: el.querySelector('enclosure')?.getAttribute('url'),
					};
					dataArr = {
						...dataArr,
						articles: [...dataArr.articles, article],
					};
				});

				setData(dataArr);
			});

		continueRender(handle);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div
			style={{
				flex: 1,
				backgroundColor: 'white',
				padding: '2.5rem',
				fontFamily: 'Helvetica, Arial',
			}}
		>
			{data && (
				<>
					<div style={{opacity, transform: `scale(${scale})`}}>
						<img src={data?.image} alt={data?.title} style={{height: '4rem'}} />
						<h2 style={{fontSize: '2.8rem', marginTop: '1rem'}}>
							{data?.title}
						</h2>
					</div>
					{data.articles?.length > 0 &&
						data.articles.map(({title, description, date, image}, i) => (
							<Sequence key={i} from={i * 200} durationInFrames={200}>
								<Article
									title={title}
									description={description}
									date={date}
									image={image}
								/>
							</Sequence>
						))}
				</>
			)}
		</div>
	);
};
