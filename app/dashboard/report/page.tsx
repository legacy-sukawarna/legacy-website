"use client";

import { useState, useMemo } from "react";
import { useConnectAttendanceReport } from "@/hooks/useConnectAttendance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { format, subYears, startOfYear, endOfYear } from "date-fns";
import { Calendar } from "lucide-react";

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>Failed to load report data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {error instanceof Error
                ? error.message
                : "Unknown error occurred"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Attendance Report
          </h1>
          <p className="text-muted-foreground">
            Connect group attendance overview for the past year
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {format(startDate, "MMM dd, yyyy")} -{" "}
          {format(endDate, "MMM dd, yyyy")}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Groups</CardDescription>
            <CardTitle className="text-4xl">
              {report?.totalGroups || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>This Month Groups with Attendance</CardDescription>
            <CardTitle className="text-4xl">
              {currentMonthData?.groupsWithAttendance || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>This Month Attendance Rate</CardDescription>
            <CardTitle className="text-4xl">
              {currentMonthData?.attendancePercentage
                ? `${
                    Math.round(currentMonthData.attendancePercentage * 10) / 10
                  }%`
                : "0%"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance Trend</CardTitle>
          <CardDescription>
            Number of groups with attendance recorded each month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                yAxisId="left"
                label={{
                  value: "Groups with Attendance",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Percentage (%)",
                  angle: 90,
                  position: "insideRight",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="attendance"
                stroke="#8884d8"
                strokeWidth={2}
                name="Groups with Attendance"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentage"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Attendance %"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
          <CardDescription>Detailed attendance data by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Month</th>
                  <th className="text-right p-2 font-medium">
                    Groups with Attendance
                  </th>
                  <th className="text-right p-2 font-medium">
                    Attendance Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {report?.monthlyAttendance?.map((item) => (
                  <tr key={item.month} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {format(new Date(item.month + "-01"), "MMMM yyyy")}
                    </td>
                    <td className="text-right p-2">
                      {item.groupsWithAttendance}
                    </td>
                    <td className="text-right p-2">
                      {Math.round(item.attendancePercentage * 10) / 10}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
