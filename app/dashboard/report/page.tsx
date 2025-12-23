"use client";

import { useMemo } from "react";
import { useConnectAttendanceReport } from "@/hooks/useConnectAttendance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subYears } from "date-fns";
import { Calendar, LineChart as LineChartIcon, Users, TrendingUp } from "lucide-react";

export default function ReportPage() {
  // Calculate 1 year date range
  const endDate = useMemo(() => new Date(), []);
  const startDate = useMemo(() => subYears(endDate, 1), [endDate]);

  const {
    data: report,
    isLoading,
    error,
  } = useConnectAttendanceReport({
    start_date: format(startDate, "yyyy-MM-dd"),
    end_date: format(endDate, "yyyy-MM-dd"),
  });

  // Get current month's data
  const currentMonthData = useMemo(() => {
    if (!report?.monthlyAttendance || report.monthlyAttendance.length === 0)
      return null;

    // Get the latest month from the report (last item in the array)
    const latestMonth =
      report.monthlyAttendance[report.monthlyAttendance.length - 1];
    return latestMonth;
  }, [report]);

  // Transform data for chart
  const chartData = useMemo(() => {
    if (!report?.monthlyAttendance) return [];

    return report.monthlyAttendance.map((item) => ({
      month: format(new Date(item.month + "-01"), "MMM yyyy"),
      attendance: item.groupsWithAttendance,
      percentage: Math.round(item.attendancePercentage * 10) / 10,
    }));
  }, [report]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md text-center">
          <div className="text-red-400 text-lg font-semibold mb-2">Error</div>
          <p className="text-slate-400 text-sm">Failed to load report data</p>
          <p className="text-slate-500 text-xs mt-2">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <LineChartIcon className="w-7 h-7 text-orange-400" />
            Attendance Report
          </h1>
          <p className="text-slate-400 mt-1">
            Connect group attendance overview for the past year
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50">
          <Calendar className="h-4 w-4 text-orange-400" />
          {format(startDate, "MMM dd, yyyy")} - {format(endDate, "MMM dd, yyyy")}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Users className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-slate-400 text-sm">Total Groups</span>
          </div>
          <div className="text-4xl font-bold text-white">
            {report?.totalGroups || 0}
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-slate-400 text-sm">This Month Active</span>
          </div>
          <div className="text-4xl font-bold text-white">
            {currentMonthData?.groupsWithAttendance || 0}
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-slate-400 text-sm">Attendance Rate</span>
          </div>
          <div className="text-4xl font-bold text-white">
            {currentMonthData?.attendancePercentage
              ? `${Math.round(currentMonthData.attendancePercentage * 10) / 10}%`
              : "0%"}
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-white">Monthly Attendance Trend</h2>
          <p className="text-slate-400 text-sm mt-1">
            Number of groups with attendance recorded each month
          </p>
        </div>
        <div className="p-5">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                angle={-45}
                textAnchor="end"
                height={80}
                stroke="#475569"
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: "#94a3b8" }}
                stroke="#475569"
                label={{
                  value: "Groups with Attendance",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#94a3b8",
                  fontSize: 12,
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "#94a3b8" }}
                stroke="#475569"
                label={{
                  value: "Percentage (%)",
                  angle: 90,
                  position: "insideRight",
                  fill: "#94a3b8",
                  fontSize: 12,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Legend wrapperStyle={{ color: "#94a3b8" }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="attendance"
                stroke="#f97316"
                strokeWidth={2}
                name="Groups with Attendance"
                dot={{ r: 4, fill: "#f97316" }}
                activeDot={{ r: 6, fill: "#f97316" }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentage"
                stroke="#22c55e"
                strokeWidth={2}
                name="Attendance %"
                dot={{ r: 4, fill: "#22c55e" }}
                activeDot={{ r: 6, fill: "#22c55e" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-white">Monthly Breakdown</h2>
          <p className="text-slate-400 text-sm mt-1">Detailed attendance data by month</p>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left p-3 font-medium text-slate-300">Month</th>
                  <th className="text-right p-3 font-medium text-slate-300">
                    Groups with Attendance
                  </th>
                  <th className="text-right p-3 font-medium text-slate-300">
                    Attendance Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {report?.monthlyAttendance?.map((item) => (
                  <tr
                    key={item.month}
                    className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="p-3 text-slate-300">
                      {format(new Date(item.month + "-01"), "MMMM yyyy")}
                    </td>
                    <td className="text-right p-3 text-slate-300">
                      {item.groupsWithAttendance}
                    </td>
                    <td className="text-right p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.attendancePercentage >= 80
                            ? "bg-green-500/20 text-green-400"
                            : item.attendancePercentage >= 50
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {Math.round(item.attendancePercentage * 10) / 10}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
