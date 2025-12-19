'use client'

import { Settings, User, Bell, Shield, LogOut } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

// TODO: Re-enable when Google OAuth is configured
const userEmail = 'drew@revelateops.com'
const userName = 'Drew Lambert'

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Section */}
      <Card className="border-slate/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-slate" />
            Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy to-cyan flex items-center justify-center text-white text-xl font-bold">
              {userEmail.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-navy">{userName}</p>
              <p className="text-sm text-slate">{userEmail}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="border-slate/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate" />
            Notifications
          </CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Task reminders</Label>
              <p className="text-sm text-slate">Get notified about upcoming due dates</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Status changes</Label>
              <p className="text-sm text-slate">Get notified when task status changes</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="border-slate/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-slate" />
            Security
          </CardTitle>
          <CardDescription>Manage your session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Sign out</Label>
              <p className="text-sm text-slate">Sign out of your TaskFlow account</p>
            </div>
            <Button
              variant="outline"
              disabled
              className="text-slate/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out (Auth disabled)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card className="border-slate/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate">
          <p><strong className="text-navy">TaskFlow</strong> - Personal Task Management</p>
          <p>Part of the Revelate Operations suite</p>
          <p className="text-xs">Version 1.0.0</p>
        </CardContent>
      </Card>
    </div>
  )
}
