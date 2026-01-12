import { Users, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";


export function AttendanceListCard() {
  // Dummy data dengan penyesuaian casing agar lebih clean
  const attendanceList = [
    { id: 1, name: "Budi Santoso", nim: "2300018225", time: "08:15" },
    { id: 2, name: "Joko Widodo", nim: "2300018226", time: "08:17" },
    { id: 3, name: "John Doe", nim: "2300018227", time: "08:20" },
    { id: 4, name: "Angelina", nim: "2300018228", time: "08:22" },
  ];

  return (
    <Card className="w-full max-w-md mx-auto shadow-sm border-zinc-200">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Daftar Hadir
          </CardTitle>
        </div>
        <CardDescription className="flex items-center gap-1.5 text-zinc-500">
          Slot 15-15 • Basis Data
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-87,5 px-6">
          <div className="space-y-4 pb-6">
            {attendanceList.map((student) => (
              <div key={student.id} className="group">
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <div className="grid gap-0.5">
                      <p className="text-sm font-medium leading-none text-zinc-900 group-hover:text-blue-600 transition-colors">
                        {student.name}
                      </p>
                      <p className="text-xs text-zinc-500 font-mono">
                        {student.nim}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                      <span className="text-xs font-semibold">{student.time}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">WIB</p>
                  </div>
                </div>
                <Separator className="mt-4 opacity-50" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex items-center justify-between bg-zinc-50/50 p-4 border-t">
        <div className="flex items-center gap-2 text-zinc-600">
          <Users className="h-4 w-4" />
          <span className="text-xs font-medium">Total: {attendanceList.length} Mahasiswa</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-[11px]">Update: 2 menit lalu</span>
        </div>
      </CardFooter>
    </Card>
  );
}
