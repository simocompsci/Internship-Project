const Header = ({ title }) => {
	return (
		<header className='bg-white shadow-sm'>
			<div className='max-w-7xl mx-auto pt-4 pb-2 px-4 sm:px-6 lg:px-8'>
				<h1 className='text-3xl font-semibold text-gray-800'>{title}</h1>
			</div>
		</header>
	);
};
export default Header;
