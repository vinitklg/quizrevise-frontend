import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface PerformanceData {
  date: string;
  score: number;
  quizSet: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  title?: string;
}

const PerformanceChart = ({ data, title = "Performance Over Time" }: PerformanceChartProps) => {
  const chartData = useMemo(() => {
    // Sort data by date and add quiz identification
    return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item, index) => ({
        date: formatDate(item.date),
        score: item.score,
        quizSet: `Set ${item.quizSet}`,
        quizId: `Q${index + 1}`,
        displayName: `Quiz ${index + 1} - Set ${item.quizSet}`
      }));
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="quizId" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                label={{ value: 'Quiz Attempts', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                label={{ 
                  value: 'Score (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Score']} 
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return `${payload[0].payload.displayName} on ${payload[0].payload.date}`;
                  }
                  return `Quiz: ${label}`;
                }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar
                dataKey="score"
                name="Quiz Score"
                fill="var(--chart-1, #3B82F6)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
