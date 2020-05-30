export default class Common {
    static convertToDisplayClass(data): string {
        if (data > 0) return "text-success"
        if (data <0 ) return "text-danger"
        return "text-dark"
    }
}