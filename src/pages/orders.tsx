import { useEffect, useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";

const headers = {
  "content-type": "application/json",
};

const requestBody = {
  query: `query MyQuery {
    marketOrdersConnection(orderBy: blockTime_DESC, first: 25) {
      totalCount
      edges {
        cursor
        node {
          amount
          blockTime
          cTokenSymbol
          from
          id
          to
          type
        }
      }
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

function Orders() {
  const [orders, setOrders] = useState<DataInterface[] | null>(null);
  useEffect(() => {
    try {
      axios(graphQLOptions).then((response) => {
        setOrders([
          ...response.data.data.marketOrdersConnection.edges.map((obj: any) => {
            return {id: obj.node.id,
              type: obj.node.type,
              to: obj.node.to,
              from: obj.node.from,
              symbol: obj.node.cTokenSymbol,
              amount: Number(obj.node.amount).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
              date: new Date(Number(obj.node.blockTime)).toLocaleDateString()
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
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-between p-4">
        <h2>Orders</h2>
        <h2>Welcome back, Massimo</h2>
      </div>
      <div className="p-4">
        <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
          <div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between">
            <span>Order</span>
            <span className="sm:text-left text-right">Type</span>
            <span className="hidden md:grid">Date</span>
            <span className="hidden sm:grid">Receiver</span>
          </div>
          <ul>
            {orders.map((order, id) => (
              <li
                key={id}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
              >
                <div className="flex">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FaShoppingBag className="text-purple-800" />
                  </div>
                  <div className="pl-4 ">
                    <p className="text-gray-800 font-bold">
                      ${order.amount.toLocaleString()}
                    </p>
                    <p className="text-gray-800 text-sm">{order.from}</p>
                  </div>
                </div>
                <p className="text-gray-600 sm:text-left text-right">
                  <span
                    className={
                      order.type == "BORROW"
                        ? "bg-amber-200 p-2 rounded-lg"
                        : order.type == "LIQUIDATE_BORROW"
                        ? "bg-red-200 p-2 rounded-lg"
                        : order.type == "MINT"
                        ? "bg-green-200 p-2 rounded-lg"
                        : order.type == "REDEEM"
                        ? "bg-purple-200 p-2 rounded-lg"
                        : order.type == "REPAY_BORROW"
                        ? "bg-yellow-200 p-2 rounded-lg"
                        : "bg-blue-200 p-2 rounded-lg"
                    }
                  >
                    {order.type}
                  </span>
                </p>
                <p className="hidden md:flex">{order.date}</p>
                <div className="sm:flex hidden justify-between items-center">
                    <p>{order.to}</p>
                    <BsThreeDotsVertical />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Orders;
