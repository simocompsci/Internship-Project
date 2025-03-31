import Header from "../components/common/Header";

import OverviewCards from "../components/analytics/OverviewCards";
import RevenueChart from "../components/analytics/RevenueChart";
import ChannelPerformance from "../components/analytics/ChannelPerformance";


const AnalyticsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-white'>
			<Header title={"Analytics Dashboard"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<OverviewCards />
				<RevenueChart />

				<div className='grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8'>
					<ChannelPerformance />
					
					
					
				</div>

				
			</main>
		</div>
	);
};
export default AnalyticsPage;
