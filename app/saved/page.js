"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Loader2, Trash2, Eye } from "lucide-react"

export default function SavedFundsPage() {
  const [savedFunds, setSavedFunds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)
  const [removingFund, setRemovingFund] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      setUser({ id: payload.userId, email: payload.email })
      fetchSavedFunds()
    } catch (error) {
      localStorage.removeItem("token")
      router.push("/login")
    }
  }, [router])

  const fetchSavedFunds = async () => {
    setIsLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/funds/saved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSavedFunds(data)
      } else {
        const data = await response.json()
        setError(data.message || "Failed to fetch saved funds")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFund = async (schemeCode) => {
    setRemovingFund(schemeCode)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/funds/remove/${schemeCode}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setSavedFunds(savedFunds.filter((fund) => fund.schemeCode !== schemeCode))
      } else {
        const data = await response.json()
        setError(data.message || "Failed to remove fund")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setRemovingFund(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading your saved funds...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">MutualFund Pro</span>
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              {user && (
                <>
                  <span className="text-gray-700">Welcome, {user.email}</span>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Saved Funds</h1>
          <p className="text-gray-600">Manage your favorite mutual funds</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {savedFunds.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedFunds.map((fund) => (
              <Card key={fund.schemeCode} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{fund.schemeName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Code: {fund.schemeCode}</Badge>
                      {fund.fundHouse && <Badge variant="outline">{fund.fundHouse}</Badge>}
                    </div>

                    <div className="text-sm text-gray-500">Saved on: {new Date(fund.savedAt).toLocaleDateString()}</div>

                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => router.push(`/fund/${fund.schemeCode}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveFund(fund.schemeCode)}
                        disabled={removingFund === fund.schemeCode}
                      >
                        {removingFund === fund.schemeCode ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">You haven't saved any mutual funds yet</div>
            <Button onClick={() => router.push("/")}>Start Exploring Funds</Button>
          </div>
        )}
      </main>
    </div>
  )
}
