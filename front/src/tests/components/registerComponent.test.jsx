import RegisterScreen from '../../components/registerComponent/registerComponent';
import Users from '../fixtures/users';
import { mountToJson } from 'enzyme-to-json';
it('should render correctly', () => {
    const wrapper = shallow(<RegisterScreen />);
    expect(wrapper).toMatchSnapshot();
});

it('should render RegisterComponentForm correctly', () => {
    const wrapper = shallow(<RegisterScreen user ={Users[0]} />);
    expect(wrapper).toMatchSnapshot();
});

it('renders email input with label given the type', () => {
    const wrapper = shallow(<RegisterScreen type = 'email' required='true'/>);
    const label = wrapper.find('Form.label');
    expect(label).toHaveLength(0);
});

it('renders submit button correctly', () => {
    const wrapper = shallow(<RegisterScreen />);
    const button = wrapper.find('button').at(0);
    expect(button).toHaveLength(1);
    expect(button.prop('type')).toEqual(undefined);
});

it('render name input correctly', () => {
    const wrapper = shallow(<RegisterScreen />);
    const nameInput = wrapper.find("input[type='text']");
});