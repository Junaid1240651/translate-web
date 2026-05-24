import LoadingScreen from "@/components/ui/LoadingScreen";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LoadingScreen variant="page" message="Loading page…" />
    </div>
  );
}
