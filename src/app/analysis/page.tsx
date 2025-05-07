import AreaChartComponent from "@/components/analysis/AreaChart"
import BarChartComponent from "@/components/analysis/BarChart"
import LineChartComponent from "@/components/analysis/LineChart"
import BottomTab from "@/components/BottomTab"

export default function AnalysisPage() {
  return (
    <main className="min-h-screen pb-24 px-4 pt-6 space-y-6 bg-gray-50">
      <AreaChartComponent />
      <BarChartComponent />
      <LineChartComponent />
      <div className="fixed bottom-0 left-0 w-full bg-white border-t z-50">
        <BottomTab />
      </div>
    </main>
  )
}
