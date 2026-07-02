
interface HeaderProps {
    title: string,
    subtitle?: string,
}

const PageHeader = ({title, subtitle}: HeaderProps) => {
  return (
    <div className="flex flex-col gap-2">
        <h1 className="text-lg md:text-xl border-b w-fit font-semibold">{title}</h1>
        <p>{subtitle}</p>
    </div>
  )
}

export default PageHeader