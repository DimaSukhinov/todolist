import {ComponentMeta, ComponentStory} from '@storybook/react';
import {Task} from '../Task';
import {Provider} from 'react-redux';
import {store} from '../state/store';

export default {
    title: 'Todolist/Task',
    component: Task,
    argTypes: {
        task: {
            description: 'object of tasks',
        },
        todolistId: {
            description: 'Id of todolist'
        }
    },
} as ComponentMeta<typeof Task>

const Template: ComponentStory<typeof Task> = (args) => <Provider store={store}><Task {...args}/></Provider>

export const IsDoneTaskStory = Template.bind({})
IsDoneTaskStory.args = {
    task: {id: '1', isDone: true, title: 'Completed task'},
    todolistId: 'todolistID1',
}

export const IsNotDoneTaskStory = Template.bind({})
IsNotDoneTaskStory.args = {
    task: {id: '2', isDone: false, title: 'Uncompleted task'},
    todolistId: 'todolistID2',
}