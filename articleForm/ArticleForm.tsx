import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import Spiner from '../spiner/Spiner';
import ErrorsList from '../errorsList/ErrorsList';

import type { IResponseError } from '../../types/errorsListTypes';
import type { IArticleFormInputs } from '../../types/articleTypes';

import styles from './articleForm.module.scss';

type ArticleFormType = (props: IArticlePropsType) => JSX.Element;
type RenderTagsType = (fields: Record<'id', string>[]) => JSX.Element | null;

interface IArticlePropsType {
    defaultValues: IArticleFormInputs;
    error: boolean;
    loading: boolean;
    errorData: IResponseError | null;
    onSubmit: SubmitHandler<IArticleFormInputs>;
}
const ArticleForm: ArticleFormType = (props) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<IArticleFormInputs>({
        mode: 'onBlur',
        defaultValues: props.defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        name: 'tags',
        control,
    });

    const onSubmit: SubmitHandler<IArticleFormInputs> = props.onSubmit;

    const onTagAdd = () => {
        append({ name: '' });
    };

    const onTagDelete = (index: number) => {
        remove(index);
    };

    const validateOptions = {
        title: {
            required: 'Title is required',
        },
        description: {
            required: 'Description is required',
        },
        body: {
            required: 'Article text is required',
        },
        tags: {
            required: 'Tag name is required',
        },
    };

    const renderTagsList: RenderTagsType = (fields) => {
        if (fields && fields.length) {
            return (
                <div className={styles.tagsWrapper}>
                    {fields.map((field, index) => (
                        <div className={styles.tag} key={field.id}>
                            <input
                                className={styles.formInput}
                                placeholder="Tag"
                                style={{
                                    borderColor:
                                        errors.tags &&
                                        errors.tags[index] &&
                                        'red',
                                }}
                                {...register(
                                    `tags.${index}.name`,
                                    validateOptions.tags
                                )}
                            />
                            <button
                                type="button"
                                className={styles.delBtn}
                                onClick={() => onTagDelete(index)}
                            >
                                Delete
                            </button>
                            {errors.tags && errors.tags[index] && (
                                <span className={styles.errors}>
                                    {errors.tags[index]?.name?.message}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const tagsList = renderTagsList(fields);

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Edit article</h2>
            <ErrorsList error={props.errorData} />
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <label className={styles.inputLabel}>
                    Title
                    <input
                        className={styles.formInput}
                        placeholder="Title"
                        style={{ borderColor: errors.title && 'red' }}
                        {...register('title', validateOptions.title)}
                    />
                    {errors.title && (
                        <span className={styles.errors}>
                            {errors.title.message}
                        </span>
                    )}
                </label>
                <label className={styles.inputLabel}>
                    Description
                    <input
                        className={styles.formInput}
                        placeholder="Description"
                        style={{ borderColor: errors.description && 'red' }}
                        {...register(
                            'description',
                            validateOptions.description
                        )}
                    />
                    {errors.description && (
                        <span className={styles.errors}>
                            {errors.description.message}
                        </span>
                    )}
                </label>
                <label className={styles.inputLabel}>
                    Text
                    <textarea
                        className={styles.formTextArea}
                        placeholder="Text"
                        style={{ borderColor: errors.body && 'red' }}
                        {...register('body', validateOptions.body)}
                    />
                    {errors.body && (
                        <span className={styles.errors}>
                            {errors.body.message}
                        </span>
                    )}
                </label>
                <div className={styles.inputLabel}>
                    Tags
                    <div className={styles.innerWrappes}>
                        {tagsList}
                        <button
                            type="button"
                            className={styles.addBtn}
                            onClick={onTagAdd}
                        >
                            Add Tag
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={props.loading}
                    className={styles.btn}
                    style={{ color: props.loading ? 'grey' : 'white' }}
                >
                    Send
                </button>
                <Spiner loading={props.loading} size="small" />
            </form>
        </div>
    );
};

export default ArticleForm;
