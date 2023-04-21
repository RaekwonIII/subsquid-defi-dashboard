import { useEffect, useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
import axios from "axios";

const headers = {
  "content-type": "application/json",
};

const requestBody = {
  query: `query MyQuery {
    marketOrders(limit: 20, orderBy: blockTime_DESC) {
      type
      to
      from
      cTokenSymbol
      id
      blockTime
      blockNumber
      amount
      underlyingAmount
      underlyingRepayAmount
      underlyingSymbol
    }
  }  
  `,
};

const graphQLOptions = {
  method: "POST",
  url: process.env.NEXT_PUBLIC_SQUID_URL || "http://localhost:4350/graphql",
  headers,
  data: requestBody,
};

type DataInterface = {
  id: string;
  type: string;
  to: string;
  from: string;
  symbol: string;
  amount: number;
  date: string;
};

function RecentOrders() {
  const [orders, setOrders] = useState<DataInterface[] | null>(null);
  useEffect(() => {
    try {
      axios(graphQLOptions).then((response) => {
        setOrders([
          ...response.data.data.marketOrders.map((obj: any) => {
            return {id: obj.id,
              type: obj.type,
              to: obj.to,
              from: obj.from,
              symbol: obj.cTokenSymbol,
              amount: Number(obj.amount).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
              date: new Date(Number(obj.blockTime)).toLocaleDateString()
            }
          }),
        ]);
      });
    } catch (err) {
      console.log("ERROR DURING AXIOS REQUEST", err);
    }
  }, []);

  if (!orders)
    return (
      <div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll">
        <h1>Recent Orders</h1>
        <div>
          <h1>No data 🤷‍♂️!</h1>
          <h2>Try to refresh the page in a short while</h2>
        </div>
      </div>
    );

  return (
    <div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll">
      <h1>Recent Orders</h1>
      <ul>
        {orders.map((order, id) => (
          <li
            key={order.id}
            className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center cursor-pointer"
          >
            <div className="bg-purple-100 rounded-lg p-3">
              <FaShoppingBag className="text-purple-800" />
            </div>
            <div className="pl-4">
              <p className="text-grey-800 font-bold">{order.amount} {order.symbol}</p>
              <p className="text-grey-400 text-sm">Address: {order.from}</p>
            </div>
            <p className="lg:flex md:hidden absolute right-6 text-sm">
              {order.date}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentOrders;
