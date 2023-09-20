interface Props {
    type: string;
    placeholder?: string;
    Ref: any;
}

export const InputField = ({ Ref, type, placeholder }: Props) => {
    return (
        <div className='form-group'>
            <input
                ref={Ref}
                type={type}
                className='form-control'
                placeholder={placeholder}
            />
        </div>
    );
};
