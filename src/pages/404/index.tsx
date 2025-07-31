import { Button } from "@/components/ui/button"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"
import { Home, ArrowLeft, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router"

export default function NotFoundPage() {
  const navigate = useNavigate()
  useDocumentTitle(`${import.meta.env.VITE_SYSTEM_NAME}`)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-lg mx-auto">
        {/* 404 Illustration */}
        <div className="relative">
          {/* Background Circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-64 h-64 rounded-full opacity-10"
              style={{ backgroundColor: "oklch(26.9% 0 0)" }}
            />
          </div>
          
          {/* 404 Text */}
          <div className="relative z-10 py-16">
            <h1 
              className="text-8xl md:text-9xl font-black tracking-tight mb-4"
              style={{ 
                background: `linear-gradient(135deg, oklch(26.9% 0 0), oklch(40% 0 0))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              404
            </h1>
            
            {/* Floating Elements */}
            <div className="absolute top-8 left-8 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="absolute top-16 right-12 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
            <div className="absolute bottom-12 left-16 w-4 h-4 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-8 right-8 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "1.5s" }} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900">
              页面走丢了
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
              抱歉，您访问的页面似乎在数字世界中迷路了。让我们帮您找到正确的方向！
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="group relative overflow-hidden px-8 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              style={{ 
                backgroundColor: "oklch(26.9% 0 0)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Home className="w-5 h-5 mr-2" />
              回到首页
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              size="lg"
              className="group px-8 py-3 font-semibold rounded-xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              style={{ 
                borderColor: "oklch(26.9% 0 0)", 
                color: "oklch(26.9% 0 0)" 
              }}
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              返回上页
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              size="lg"
              className="group px-8 py-3 font-semibold rounded-xl transition-all duration-300 hover:bg-gray-100"
            >
              <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              刷新页面
            </Button>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="pt-8">
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            遇到问题？
            <button 
              className="ml-1 font-medium hover:underline transition-colors duration-200"
              style={{ color: "oklch(26.9% 0 0)" }}
            >
              联系我们
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
