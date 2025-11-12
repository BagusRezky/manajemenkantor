import { CutiTahunan } from "@/types/cuti"
import { ColumnDef } from "@tanstack/react-table"


export const columns: ColumnDef<CutiTahunan>[] = [
  {
    accessorKey: "nama_karyawan",
    header: "Nama Karyawan",
  },
  {
    accessorKey: "total_cuti_tahunan",
    header: "Total Cuti Tahunan",
    cell: ({ getValue }) => <span>{getValue<number>()} Hari</span>,
  },
  {
    accessorKey: "cuti_digunakan",
    header: "Cuti Digunakan",
    cell: ({ getValue }) => <span>{getValue<number>()} Hari</span>,
  },
  {
    accessorKey: "sisa_cuti_tahunan",
    header: "Sisa Cuti Tahunan",
    cell: ({ getValue }) => {
      const value = getValue<number>()
      return (
        <span className={value <= 0 ? "text-red-500 font-semibold" : "text-green-600"}>
          {value} Hari
        </span>
      )
    },
  },
]
