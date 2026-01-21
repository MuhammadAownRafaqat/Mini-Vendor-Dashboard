import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Dashboard() {
  const [serviceName, setServiceName] = useState("")
  const [servicePrice, setServicePrice] = useState("")
  const [services, setServices] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  // Initialize user ID and fetch services
  useEffect(() => {
    const init = async () => {
      // Get current logged-in user
      const { data } = await supabase.auth.getUser()
      const uid = data.user?.id ?? null
      setUserId(uid)

      // Load initial services
      if (uid) fetchServices(uid)

      // Subscribe to realtime changes in services table
      const channel = supabase
        .channel("public:services")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "services",
            filter: `user_id=eq.${uid}`,
          },
          (_payload) => {
            fetchServices(uid)
          }
        )
        .subscribe()

      return () => supabase.removeChannel(channel)
    }

    init()
  }, [])

  // Fetch services from Supabase for the logged-in user
  const fetchServices = async (uid: string | null) => {
    if (!uid) return
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })

    if (error) return console.error(error)
    setServices(data ?? [])
  }

  // Add a new service
  const addService = async () => {
    if (!serviceName || !servicePrice) return alert("Fill all fields")
    if (!userId) return alert("User not found")

    const { error } = await supabase.from("services").insert([
      {
        user_id: userId,
        name: serviceName,
        price: parseFloat(servicePrice),
      },
    ])

    if (error) return alert(error.message)

    // Clear input fields
    setServiceName("")
    setServicePrice("")
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Vendor Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{services.length}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">0</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Earnings</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">$0</CardContent>
        </Card>
      </div>

      {/* Add Service Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Service</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="Service name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
          <Input
            placeholder="Price"
            type="number"
            value={servicePrice}
            onChange={(e) => setServicePrice(e.target.value)}
          />
          <Button onClick={addService}>Add</Button>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Services</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>${s.price}</TableCell>
                </TableRow>
              ))}
              {services.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-gray-500">
                    No services added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
