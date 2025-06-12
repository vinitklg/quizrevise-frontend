var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
var PerformanceChart = function (_a) {
    var data = _a.data, _b = _a.title, title = _b === void 0 ? "Performance Over Time" : _b;
    var chartData = useMemo(function () {
        // Sort data by date and add quiz identification
        return __spreadArray([], data, true).sort(function (a, b) { return new Date(a.date).getTime() - new Date(b.date).getTime(); })
            .map(function (item, index) { return ({
            date: formatDate(item.date),
            score: item.score,
            quizSet: "Set ".concat(item.quizSet),
            quizId: "Q".concat(index + 1),
            displayName: "Quiz ".concat(index + 1, " - Set ").concat(item.quizSet)
        }); });
    }, [data]);
    return (<Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
        }}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="quizId" tick={{ fontSize: 12 }} tickMargin={10} label={{ value: 'Quiz Attempts', position: 'insideBottom', offset: -5 }}/>
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickMargin={10} label={{
            value: 'Score (%)',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
        }}/>
              <Tooltip formatter={function (value) { return ["".concat(value, "%"), 'Score']; }} labelFormatter={function (label, payload) {
            if (payload && payload[0]) {
                return "".concat(payload[0].payload.displayName, " on ").concat(payload[0].payload.date);
            }
            return "Quiz: ".concat(label);
        }} contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}/>
              <Legend />
              <Bar dataKey="score" name="Quiz Score" fill="var(--chart-1, #3B82F6)" radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>);
};
export default PerformanceChart;
