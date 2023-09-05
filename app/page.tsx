"use client";

import DropdownWrapper from "@/components/DropdownWrapper";
import axiosInstance from "@/utils/axios";
import { format, parseISO, subDays } from "date-fns";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";
import Slider from "react-slick";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { data } from "../utils/dummyData";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

type ChartData = {
  date: string;
  value: number;
};

const Home = () => {
  const [dropdown, setDropdown] = useState(false);
  const [dropdown2, setDropdown2] = useState(false);
  const [temperature, setTemperature] = useState<ChartData[]>([]);
  const [windSpeed, setWindSpeed] = useState<ChartData[]>([]);
  const [windChill, setWindChill] = useState<ChartData[]>([]);
  const [speed, setSpeed] = useState<number>(1);
  const busElement = useRef<HTMLParagraphElement>(null);
  const speedElement = useRef<HTMLParagraphElement>(null);
  // const [data, setData] = useState<ChartData[]>([]);
  const sliderRef = useRef<Slider>(null);
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "linear",
  };

  const values = useMemo(
    () => [windSpeed, temperature, windChill],
    [temperature, windSpeed, windChill]
  );

  const buses = useMemo(
    () => ["Bus 1", "Bus 2", "Bus 3", "Bus 4", "Bus 5"],
    []
  );

  const speeds = useMemo(() => [0.5, 0.75, 1, 1.5, 1.75, 2], []);

  const next = () => {
    sliderRef.current!.slickNext();
  };

  const prev = () => {
    sliderRef.current!.slickPrev();
  };

  const fetchData = useCallback(async () => {
    // const data = await axiosInstance.get(
    //   `/${process.env.NEXT_PUBLIC_CHANNEL_ID}/feeds.json?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
    // );
    // console.log(data);

    let idx = 0;
    setInterval(() => {
      if (data.feeds.length > 0 && idx < data.feeds.length - 1) {
        setTemperature((prev) => [
          ...prev,
          { date: data.feeds[idx].created_at, value: +data.feeds[idx].field2 },
        ]);
        setWindSpeed((prev) => [
          ...prev,
          { date: data.feeds[idx].created_at, value: +data.feeds[idx].field1 },
        ]);
        setWindChill((prev) => [
          ...prev,
          { date: data.feeds[idx].created_at, value: +data.feeds[idx].field3 },
        ]);
        idx++;
      }
    }, 1000 / speed);
  }, [speed, busElement.current]);

  const replay = () => {
    setTemperature([]);
    setWindSpeed([]);
    setWindChill([]);
    fetchData();
  };

  useEffect(() => {
    replay();
  }, [speed]);

  useEffect(() => {
    fetchData();
    if (busElement.current) busElement.current.textContent = buses[0];
    if (speedElement.current)
      speedElement.current.textContent = "" + speeds[2] + "x";
  }, []);

  return (
    <main className="flex min-h-full flex-col border-2 rounded-lg border-gray-400 m-2 md:m-5 p-2 md:p-5">
      <div className="flex flex-col md:flex-row justify-between md:items-center w-[95%] mx-auto pb-5 border-b-2">
        <div className="text-xl font-bold flex-1">Power System Analysis</div>

        <div className="flex items-center space-x-2 pt-3 md:pt-0">
          <button
            onClick={replay}
            className="relative flex items-center border border-shade-light rounded-md p-1 hover:cursor-pointer px-3 py-1.5 hover:bg-gray-200 text-sm font-semibold"
          >
            Replay
          </button>
          <aside
            onClick={() => {
              setDropdown(!dropdown);
            }}
            className="relative flex items-center border border-shade-light rounded-md p-1 hover:cursor-pointer px-3 py-2"
          >
            <p ref={speedElement} className="text-xs font-semibold pr-2" />
            <IoIosArrowDown
              className={`w-4 h-4 text-shade-medium ${
                dropdown ? `rotate-180` : "rotate-0"
              }`}
            />

            {dropdown && (
              <DropdownWrapper setDropdown={setDropdown}>
                <span
                  className={`absolute z-10 right-0 top-9 p-5 w-44 flex flex-col space-y-3 bg-white rounded-md border border-shade-light shadow-xl`}
                >
                  {speeds.map((speed, i) => (
                    <p
                      key={i}
                      onClick={(e) => {
                        if (
                          speedElement.current &&
                          e.currentTarget.textContent
                        ) {
                          speedElement.current.textContent =
                            e.currentTarget.textContent;
                        }
                        setSpeed(speed);
                        setDropdown(false);
                      }}
                      className="hover:cursor-pointer hover:bg-primary-1 link font-semibold w-full"
                    >
                      {speed}x
                    </p>
                  ))}
                </span>
              </DropdownWrapper>
            )}
          </aside>
          <aside
            onClick={() => {
              setDropdown2(!dropdown2);
            }}
            className="relative flex items-center border border-shade-light rounded-md p-1 hover:cursor-pointer px-3 py-2"
          >
            <p ref={busElement} className="text-xs font-semibold pr-2" />
            <IoIosArrowDown
              className={`w-4 h-4 text-shade-medium ${
                dropdown2 ? `rotate-180` : "rotate-0"
              }`}
            />

            {dropdown2 && (
              <DropdownWrapper setDropdown={setDropdown2}>
                <span
                  className={`absolute z-10 right-0 top-9 p-5 w-44 flex flex-col space-y-3 bg-white rounded-md border border-shade-light shadow-xl`}
                >
                  {buses.map((bus, i) => (
                    <p
                      key={i}
                      onClick={(e) => {
                        if (busElement.current && e.currentTarget.textContent) {
                          busElement.current.textContent =
                            e.currentTarget.textContent;
                        }
                        setDropdown2(false);
                      }}
                      className="hover:cursor-pointer hover:bg-primary-1 link font-semibold w-full"
                    >
                      {bus}
                    </p>
                  ))}
                </span>
              </DropdownWrapper>
            )}
          </aside>
        </div>
      </div>

      <div className="flex w-[98%] mx-auto item-center h-[85vh] md:h-full overflow-auto">
        <aside
          onClick={prev}
          className="w-[3%] hidden md:flex items-center hover:cursor-pointer text-shade-dark justify-center"
        >
          <IoIosArrowBack className="h-8 w-8" />
        </aside>
        <div className="w-full md:w-[95%] mx-auto hidden md:block">
          <Slider ref={sliderRef} {...settings}>
            {values.map((each, i) => (
              <div
                key={i}
                className="flex flex-col space-y-3 my-5 font-semibold text-lg"
              >
                <p>
                  {data.channel[`field${i + 1}` as keyof typeof data.channel]
                    .toString()[0]
                    .toUpperCase() +
                    data.channel[`field${i + 1}` as keyof typeof data.channel]
                      .toString()
                      .slice(1)}
                </p>
                <section className="h-[70vh]">
                  <ResponsiveContainer
                    className={"text-xs md:text-base w-full"}
                  >
                    <LineChart
                      data={each}
                      margin={{ top: 15, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="2" opacity={0.5} />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(str) => {
                          const date = parseISO(str);
                          return format(date, "HH:mm");
                        }}
                        label={{
                          value: `Date`,
                          angle: 0,
                          position: "bottom",
                        }}
                      />
                      <YAxis
                        dataKey="value"
                        axisLine={false}
                        tickLine={false}
                        tickCount={20}
                        tickFormatter={(number) => `${number.toFixed(2)}`}
                        label={{
                          value: `${
                            data.channel[
                              `field${i + 1}` as keyof typeof data.channel
                            ]
                              .toString()[0]
                              .toUpperCase() +
                            data.channel[
                              `field${i + 1}` as keyof typeof data.channel
                            ]
                              .toString()
                              .slice(1)
                          }`,
                          angle: -90,
                          position: "left",
                        }}
                      />
                      <Tooltip
                        content={({ active, label, payload }) => (
                          <CustomToolTip
                            active={!!active}
                            label={label}
                            payload={payload as any[]}
                          />
                        )}
                      />

                      <Line
                        type="linear"
                        dataKey="value"
                        stroke="#673DE6"
                        fill="url(#color)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </section>
              </div>
            ))}
          </Slider>
        </div>
        <aside
          onClick={next}
          className="w-[3%] hidden md:flex items-center hover:cursor-pointer text-shade-dark justify-center"
        >
          <IoIosArrowForward className="h-8 w-8" />
        </aside>

        <section className="md:hidden flex flex-col space-y-5 w-full">
          <div className="flex flex-col space-y-3 my-5 pb-5 border-b border-gray-300">
            <p>
              {data.channel[`field${1}` as keyof typeof data.channel]
                .toString()[0]
                .toUpperCase() +
                data.channel[`field${1}` as keyof typeof data.channel]
                  .toString()
                  .slice(1)}
            </p>
            <section className="h-[40vh] w-screen overflow-x-auto">
              <ResponsiveContainer
                className={"-ml-5 md:ml-0 text-xs md:text-base w-full"}
              >
                <LineChart data={values[0]}>
                  <CartesianGrid strokeDasharray="2" opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(str) => {
                      const date = parseISO(str);
                      return format(date, "MMM, d");
                    }}
                  />
                  <YAxis
                    dataKey="value"
                    axisLine={false}
                    tickLine={false}
                    tickCount={10}
                    tickFormatter={(number) => `${number.toFixed(2)}`}
                  />
                  <Tooltip
                    content={({ active, label, payload }) => (
                      <CustomToolTip
                        active={!!active}
                        label={label}
                        payload={payload as any[]}
                      />
                    )}
                  />
                  <Legend />
                  <Line
                    type="linear"
                    dataKey="value"
                    stroke="#673DE6"
                    fill="url(#color)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </section>
          </div>

          <div className="flex flex-col space-y-3 my-5 pb-5 border-b border-gray-300">
            <p>
              {data.channel[`field${2}` as keyof typeof data.channel]
                .toString()[0]
                .toUpperCase() +
                data.channel[`field${2}` as keyof typeof data.channel]
                  .toString()
                  .slice(1)}
            </p>
            <section className="h-[40vh] w-screen overflow-x-auto">
              <ResponsiveContainer
                className={"-ml-5 md:ml-0 text-xs md:text-base w-full"}
              >
                <LineChart data={values[1]}>
                  <CartesianGrid strokeDasharray="2" opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(str) => {
                      const date = parseISO(str);
                      return format(date, "MMM, d");
                    }}
                  />
                  <YAxis
                    dataKey="value"
                    axisLine={false}
                    tickLine={false}
                    tickCount={10}
                    tickFormatter={(number) => `${number.toFixed(2)}`}
                  />
                  <Tooltip
                    content={({ active, label, payload }) => (
                      <CustomToolTip
                        active={!!active}
                        label={label}
                        payload={payload as any[]}
                      />
                    )}
                  />
                  <Legend />
                  <Line
                    type="linear"
                    dataKey="value"
                    stroke="#673DE6"
                    fill="url(#color)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </section>
          </div>

          <div className="flex flex-col space-y-3 my-5 pb-5 border-b border-gray-300">
            <p>
              {data.channel[`field${3}` as keyof typeof data.channel]
                .toString()[0]
                .toUpperCase() +
                data.channel[`field${3}` as keyof typeof data.channel]
                  .toString()
                  .slice(1)}
            </p>
            <section className="h-[40vh] w-screen overflow-x-auto">
              <ResponsiveContainer
                className={"-ml-5 md:ml-0 text-xs md:text-base w-full"}
              >
                <LineChart data={values[2]}>
                  <CartesianGrid strokeDasharray="2" opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(str) => {
                      const date = parseISO(str);
                      return format(date, "MMM, d");
                    }}
                  />
                  <YAxis
                    dataKey="value"
                    axisLine={false}
                    tickLine={false}
                    tickCount={10}
                    tickFormatter={(number) => `${number.toFixed(2)}`}
                  />
                  <Tooltip
                    content={({ active, label, payload }) => (
                      <CustomToolTip
                        active={!!active}
                        label={label}
                        payload={payload as any[]}
                      />
                    )}
                  />
                  <Legend />
                  <Line
                    type="linear"
                    dataKey="value"
                    stroke="#673DE6"
                    fill="url(#color)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;

const CustomToolTip = ({
  active,
  payload = [],
  label = "",
}: {
  active: boolean;
  payload: any[];
  label: string;
}) => {
  if (!active) return null;

  return (
    <div className="text-sm border rounded-lg bg-white flex flex-col space-y-1 p-4">
      <p className="text-primary-6">
        {format(new Date(label), "KK:mm:ss aaa") ?? ""}
      </p>
      {payload?.length !== 0 ? (
        <p>{payload[0]?.value?.toFixed(2) ?? ""}</p>
      ) : null}
    </div>
  );
};
