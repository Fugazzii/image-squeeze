interface Props {
    context: string;
    href: string;
}

export function Icon({ href, context }: Props) {
    return (
        <a href={href}>
            <i className={context}></i>
        </a>
    );
}
