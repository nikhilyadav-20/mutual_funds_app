"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ArrowLeft, Loader2, Heart, HeartOff } from "lucide-react"

export default function FundDetailPage() {
  const [fund, setFund] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const [savingFund, setSavingFund] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUser({ id: payload.userId, email: payload.email })
      } catch (error) {
        localStorage.removeItem("token")
      }
    }

    if (params.schemeCode) {
      fetchFundDetails(params.schemeCode)
      if (token) {
        checkIfSaved(params.schemeCode)
      }
    }
  }, [params.schemeCode])

  const fetchFundDetails = async (schemeCode) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`https://api.mfapi.in/mf/${schemeCode}`)
      const data = await response.json()

      if (response.ok) {
        setFund(data)
      } else {
        setError("Failed to fetch fund details")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const checkIfSaved = async (schemeCode) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/funds/saved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const savedFunds = await response.json()
        setIsSaved(savedFunds.some((savedFund) => savedFund.schemeCode === schemeCode))
      }
    } catch (error) {
      console.error("Error checking saved status:", error)
    }
  }

  const handleSaveFund = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    setSavingFund(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/funds/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          schemeCode: fund.meta.scheme_code,
          schemeName: fund.meta.scheme_name,
          fundHouse: fund.meta.fund_house,
        }),
      })

      if (response.ok) {
        setIsSaved(true)
      } else {
        const data = await response.json()
        setError(data.message || "Failed to save fund")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setSavingFund(false)
    }
  }

  const handleRemoveFund = async () => {
    setSavingFund(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/funds/remove/${fund.meta.scheme_code}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setIsSaved(false)
      } else {
        const data = await response.json()
        setError(data.message || "Failed to remove fund")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setSavingFund(false)
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
          <span className="ml-2 text-lg">Loading fund details...</span>
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
              {user ? (
                <>
                  <span className="text-gray-700">Welcome, {user.email}</span>
                  <Button variant="outline" onClick={() => router.push("/saved")}>
                    My Funds
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => router.push("/login")}>
                    Login
                  </Button>
                  <Button onClick={() => router.push("/register")}>Register</Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {fund && (
          <div className="space-y-6">
            {/* Fund Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{fund.meta.scheme_name}</CardTitle>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">Code: {fund.meta.scheme_code}</Badge>
                      <Badge variant="outline">{fund.meta.fund_house}</Badge>
                      <Badge variant="outline">{fund.meta.scheme_type}</Badge>
                      <Badge variant="outline">{fund.meta.scheme_category}</Badge>
                    </div>
                  </div>
                  {user && (
                    <Button
                      onClick={isSaved ? handleRemoveFund : handleSaveFund}
                      disabled={savingFund}
                      variant={isSaved ? "destructive" : "default"}
                      className="flex items-center gap-2"
                    >
                      {savingFund ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isSaved ? (
                        <HeartOff className="h-4 w-4" />
                      ) : (
                        <Heart className="h-4 w-4" />
                      )}
                      {savingFund ? "Processing..." : isSaved ? "Remove from Saved" : "Save Fund"}
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* NAV History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent NAV History</CardTitle>
              </CardHeader>
              <CardContent>
                {fund.data && fund.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Date</th>
                          <th className="text-right py-2">NAV</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fund.data.slice(0, 10).map((nav, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{nav.date}</td>
                            <td className="text-right py-2">₹{nav.nav}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No NAV data available</p>
                )}
              </CardContent>
            </Card>

            {/* Current NAV */}
            {fund.data && fund.data.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Current NAV</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">₹{fund.data[0].nav}</div>
                  <p className="text-gray-500">As of {fund.data[0].date}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
