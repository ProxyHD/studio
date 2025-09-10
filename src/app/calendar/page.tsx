import { SiteHeader } from '@/components/layout/site-header';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-full">
      <SiteHeader title="Calendário" />
      <div className="flex-1 p-4 pt-6 md:p-8">
        <Card>
          <CardContent className="p-2 md:p-4">
            <Calendar
              mode="single"
              className="p-0 w-full"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                month: "space-y-4 w-full",
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full",
                head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-16 w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-16 w-full p-1 font-normal aria-selected:opacity-100",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
