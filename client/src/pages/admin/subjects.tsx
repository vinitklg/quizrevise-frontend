import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface Subject {
  id: number;
  name: string;
  code: string;
  board: string;
  gradeLevel: number;
  stream: string | null;
  description: string | null;
  isCore: boolean | null;
}

export default function AdminSubjects() {
  const { data: subjects, isLoading } = useQuery<Subject[]>({
    queryKey: ["/api/admin/subjects"],
  });

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const groupedSubjects = subjects?.reduce((acc, subject) => {
    const key = `${subject.board}-${subject.gradeLevel}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(subject);
    return acc;
  }, {} as Record<string, Subject[]>) || {};

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subject Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage curriculum subjects across boards</p>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedSubjects).map(([key, groupSubjects]) => {
              const [board, grade] = key.split('-');
              return (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle>{board} - Grade {grade} ({groupSubjects.length} subjects)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject Name</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Stream</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groupSubjects.map((subject) => (
                          <TableRow key={subject.id}>
                            <TableCell className="font-medium">{subject.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{subject.code}</Badge>
                            </TableCell>
                            <TableCell>{subject.stream || 'All'}</TableCell>
                            <TableCell>
                              <Badge variant={subject.isCore ? 'default' : 'secondary'}>
                                {subject.isCore ? 'Core' : 'Elective'}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {subject.description || 'No description'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              );
            })}
            
            {Object.keys(groupedSubjects).length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No subjects found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}