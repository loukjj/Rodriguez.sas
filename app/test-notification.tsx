import FloatingNotificationButton from "./components/FloatingNotificationButton";

export default function TestNotificationPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-8">Test Notification Button</h1>
      <p className="mb-4">This page tests the FloatingNotificationButton component.</p>
      <FloatingNotificationButton />
    </div>
  );
}