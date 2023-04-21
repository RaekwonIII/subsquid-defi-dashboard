import { useEffect, useState } from "react";

import axios from "axios";

const headers = {
  "content-type": "application/json",
};

const latestMarketRequestBody = {
  query: `query latestMarketQuery {
    markets(limit: 1, orderBy: blockTimestamp_DESC, where: {underlyingPriceUSD_not_eq: "0"}) {
      totalSupply
      totalBorrows
      symbol
      supplyRate
      reserves
      name
      cash
      borrowRate
      underlyingPriceUSD
      underlyingDecimals
      blockTimestamp
    }
  }`,
};

const yesterdayMarketRequestBody = {
  query: `query yesterdayMarketQuery {
    markets(limit: 1, orderBy: blockTimestamp_DESC, where: {AND: {blockTimestamp_lt: "1681985229000", underlyingPriceUSD_not_eq: "0"}}) {
        totalSupply
        totalBorrows
        supplyRate
        reserves
        cash
        borrowRate
        underlyingPriceUSD
        blockTimestamp
    }
  }`,
};

const graphQLOptions = {
  method: "POST",
  url: process.env.NEXT_PUBLIC_SQUID_URL || "http://localhost:4350/graphql",
  headers,
  data: latestMarketRequestBody,
};

type DataInterface = {
  symbol: string;
  name: string;
  totalSupply: number;
  totalSupplyStr: string;
  totalBorrows: number;
  totalBorrowsStr: string;
  supplyRate: number;
  reserves: number;
  reservesStr: string;
  cash: number;
  cashStr: string;
  borrowRate: number;
  price: number;
  priceStr: string;
  underlyingDecimals: number;
};

function TopCards() {
  const [latestData, setLatestData] = useState<DataInterface | null>(null);
  const [yesterdayData, setYesterdayData] = useState<DataInterface | null>(null);
  useEffect(() => {
    try {
      axios(graphQLOptions).then((response) => {
        const obj = response.data.data.markets[0];
        setLatestData({
          symbol: obj.symbol,
          name: obj.name,
          totalSupply: obj.totalSupply,
          totalSupplyStr: Number(obj.totalSupply).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
          totalBorrows: obj.totalBorrows,
          totalBorrowsStr: Number(obj.totalBorrows).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
          supplyRate: obj.supplyRate,
          reserves: obj.reserves,
          reservesStr: Number(obj.reserves).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
          cash: obj.cash,
          cashStr: Number(obj.cash).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
          borrowRate: obj.borrowRate,
          price: obj.underlyingPriceUSD,
          priceStr: Number(obj.underlyingPriceUSD).toLocaleString(undefined, { maximumFractionDigits: 3, minimumFractionDigits: 3 }),
          underlyingDecimals: obj.underlyingDecimals,
          //   date: new Date(Number(obj.blockTime)).toLocaleDateString(),
        });
      });

      // change query to get yesterday data
      graphQLOptions.data = yesterdayMarketRequestBody;

      axios(graphQLOptions).then((response) => {
        const obj = response.data.data.markets[0];
        setYesterdayData({
          symbol: "",
          name: "",
          totalSupply: obj.totalSupply,
          totalSupplyStr: "",
          totalBorrows: obj.totalBorrows,
          totalBorrowsStr: "",
          supplyRate: obj.supplyRate,
          reserves: obj.reserves,
          reservesStr: "",
          cash: obj.cash,
          cashStr: "",
          borrowRate: obj.borrowRate,
          price: obj.underlyingPriceUSD,
          priceStr: "",
          underlyingDecimals: obj.underlyingDecimals,
        });
      });
    } catch (err) {
      console.log("ERROR DURING AXIOS REQUEST", err);
    }
  }, []);

  if (!latestData || !yesterdayData)
    return (
      <div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll">
        <h1>Recent Orders</h1>
        <div>
          <h1>No data 🤷‍♂️!</h1>
          <h2>Try to refresh the page in a short while</h2>
        </div>
      </div>
    );
  
        const supplyDiff = Number((latestData.totalSupply - yesterdayData.totalSupply) * 100 / latestData.totalSupply).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
        const borrowsDiff = Number((latestData.totalBorrows - yesterdayData.totalBorrows) * 100 / latestData.totalBorrows).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
        const cashDiff = Number((latestData.cash - yesterdayData.cash) * 100 / latestData.cash).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
        const reservesDiff = Number((latestData.reserves - yesterdayData.reserves) * 100 / latestData.reserves).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
        const priceDiff = Number(Number((latestData.price - yesterdayData.price) * 100 / latestData.price).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }));
        
  return (
    <div className="grid lg:grid-cols-9 grid-cols-5 gap-4 p-4">
      <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full pb-4">
          <p className="text-2xl font-bold">{latestData.totalSupplyStr} {latestData.symbol}</p>
          <p className="text-grey-600">Total Supply</p>
        </div>
        <p className="bg-green-200 flex justify-center items-center p-2 rounded-lg">
          <span className="text-green-700 text-lg">{supplyDiff}%</span>
        </p>
      </div>
      <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full pb-4">
          <p className="text-2xl font-bold">{latestData.totalBorrowsStr} {latestData.symbol}</p>
          <p className="text-grey-600">Total Borrows</p>
        </div>
        <p className="bg-green-200 flex justify-center items-center p-2 rounded-lg">
          <span className="text-green-700 text-lg">{borrowsDiff}%</span>
        </p>
      </div>
      <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full pb-4">
          <p className="text-2xl font-bold">{latestData.cashStr} {latestData.symbol}</p>
          <p className="text-grey-600">Liquidity</p>
        </div>
        <p className="bg-green-200 flex justify-center items-center p-2 rounded-lg">
          <span className="text-green-700 text-lg">{cashDiff}%</span>
        </p>
      </div>
      <div className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full pb-4">
          <p className="text-2xl font-bold">{latestData.reservesStr} {latestData.symbol}</p>
          <p className="text-grey-600">Reserves</p>
        </div>
        <p className="bg-green-200 flex justify-center items-center p-2 rounded-lg">
          <span className="text-green-700 text-lg">{reservesDiff}%</span>
        </p>
      </div>
      <div className="col-span-1 bg-white flex justify-between w-full border p-4 rounded-lg">
        <div className="flex flex-col w-full pb-4">
          <p className="text-2xl font-bold">$ {latestData.priceStr}</p>
          <p className="text-grey-600">Price</p>
        </div>
        <p className={
                      priceDiff < 0
                        ? "bg-red-200 flex justify-center items-center p-2 rounded-lg"
                        : "bg-green-200 flex justify-center items-center p-2 rounded-lg"
                    }>
          <span className={
                      priceDiff < 0
                        ? "text-red-700 text-lg"
                        : "text-green-700 text-lg"
                    }>{priceDiff}%</span>
        </p>
      </div>
    </div>
  );
}

export default TopCards;
