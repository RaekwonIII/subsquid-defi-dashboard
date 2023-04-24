import LineChart from "@/components/LineChart";
import Header from "@/components/Header"
import RecentOrders from "@/components/RecentOrders";
import TopCards from "@/components/TopCards";
import Head from "next/head";


export default function Home() {
  return (
    <>
      <Head>
        <title>DeFi Dashboard</title>
        <meta name="description" content="with Subsquid indexing middleware" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100 min-h-screen"> 
        {/* <h1 className="text-3xl font-bold underline">Hello world!</h1> */}
        <Header />
        <TopCards />
        <div className="p-4 grid md:grid-cols-3 grid-cols-1 gap-4">
          <LineChart />
          <RecentOrders />
        </div>
      </main>
    </>
  );
}
