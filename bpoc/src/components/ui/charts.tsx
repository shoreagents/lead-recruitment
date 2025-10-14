'use client'

import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Line Chart Component
export function LineChartComponent({ data, dataKey, stroke = "#06b6d4" }: {
  data: any[]
  dataKey: string
  stroke?: string
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="name" 
          stroke="#9ca3af"
          fontSize={12}
        />
        <YAxis 
          stroke="#9ca3af"
          fontSize={12}
        />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={stroke} 
          strokeWidth={3}
          dot={{ fill: stroke, strokeWidth: 2, r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Area Chart Component
export function AreaChartComponent({ data, dataKey, fill = "#10b981" }: {
  data: any[]
  dataKey: string
  fill?: string
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={fill} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={fill} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="name" 
          stroke="#9ca3af"
          fontSize={12}
        />
        <YAxis 
          stroke="#9ca3af"
          fontSize={12}
        />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          fill="url(#areaGradient)" 
          stroke={fill}
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Bar Chart Component
export function BarChartComponent({ data, dataKey, fill = "#8b5cf6" }: {
  data: any[]
  dataKey: string
  fill?: string
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={fill} stopOpacity={1}/>
            <stop offset="95%" stopColor={fill} stopOpacity={0.7}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="name" 
          stroke="#9ca3af"
          fontSize={12}
        />
        <YAxis 
          stroke="#9ca3af"
          fontSize={12}
        />
        <Tooltip />
        <Bar dataKey={dataKey} fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Pie Chart Component
export function PieChartComponent({ data }: {
  data: { name: string; value: number; color: string }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Mini Stats Chart Component
export function MiniStatsChart({ data, dataKey, color = "#3b82f6" }: {
  data: any[]
  dataKey: string
  color?: string
}) {
  return (
    <ResponsiveContainer width="100%" height={60}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color}
          fill={`url(#gradient-${dataKey})`}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
} 