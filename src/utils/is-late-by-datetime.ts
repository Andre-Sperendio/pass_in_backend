export function isLateByDatetime (limitDate: string, limitTime: string): boolean {
    
    const currentDateTime = new Date()
    currentDateTime.setHours(currentDateTime.getHours() - 3);
    
    let [year, month, day] = limitDate.split('-').map(Number)
    let [hours, minutes, seconds] = limitTime.split(':').map(Number)
    const limitDateTime = new Date(year, month - 1, day, hours - 3, minutes, seconds)

    if (currentDateTime <= limitDateTime) {
        return false
    }

    return true

}
