import LoginScreen from '../../components/loginComponent/loginComponent';
import Users from '../fixtures/users';
import { shallowToJson } from 'enzyme-to-json';


it('should render correctly', () => {
    const wrapper = shallow(<LoginScreen />);
    expect(wrapper).toMatchSnapshot();
});

it('Should render correctly passing an user', () => {
    const wrapper = shallow(<LoginScreen user = {Users[1]}/>);
    expect(wrapper).toMatchSnapshot();
});

it('render email input label given the type', () => {
    const wrapper = shallow(<LoginScreen type = 'email' required = 'true'/>);
    const label = wrapper.find('Form.Control');
    expect(label).toHaveLength(0);
});

it('should handle handleSubmit', () => {
    let handleSubmit = jest.fn();
    let history = {push: jest.fn()};
    const wrapper = shallow(<LoginScreen handleSubmit = {handleSubmit} history= {history}/>);
    wrapper.find('Button').prop('submit');
});
