import {ComponentMeta, ComponentStory} from '@storybook/react';
import {EditableSpan} from '../EditableSpan';
import {action} from '@storybook/addon-actions';

export default {
    title: 'Todolist/EditableSpan',
    component: EditableSpan,
    argTypes: {
        onChange: {
            description: 'callback',
        },
        title: {
            description: 'value in span',
            defaultValue: 'title',
        },
    },
} as ComponentMeta<typeof EditableSpan>

const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args}/>

export const EditableSpanOn = Template.bind({})

EditableSpanOn.args = {
    onChange: action('EditableSpan changed')
}