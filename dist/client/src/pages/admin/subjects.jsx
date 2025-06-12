import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminSidebar from "@/components/admin/AdminSidebar";
export default function AdminSubjects() {
    var _a = useQuery({
        queryKey: ["/api/admin/subjects"],
    }), subjects = _a.data, isLoading = _a.isLoading;
    if (isLoading) {
        return (<div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"/>
        </div>
      </div>);
    }
    var groupedSubjects = (subjects === null || subjects === void 0 ? void 0 : subjects.reduce(function (acc, subject) {
        var key = "".concat(subject.board, "-").concat(subject.gradeLevel);
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(subject);
        return acc;
    }, {})) || {};
    return (<div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subject Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage curriculum subjects across boards</p>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedSubjects).map(function (_a) {
            var key = _a[0], groupSubjects = _a[1];
            var _b = key.split('-'), board = _b[0], grade = _b[1];
            return (<Card key={key}>
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
                        {groupSubjects.map(function (subject) { return (<TableRow key={subject.id}>
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
                          </TableRow>); })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>);
        })}
            
            {Object.keys(groupedSubjects).length === 0 && (<Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No subjects found</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>
    </div>);
}
