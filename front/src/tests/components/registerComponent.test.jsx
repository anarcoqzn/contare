import RegisterScreen from '../../components/registerComponent/registerComponent';
import Users from '../fixtures/users';
it('should render correctly', () => {
    const wrapper = shallow(<RegisterScreen />);
    expect(wrapper).toMatchSnapshot();
});

it('should render RegisterComponentForm correctly', () => {
    const wrapper = shallow(<RegisterScreen user ={Users[1]} />);
    expect(wrapper).toMatchSnapshot();
});

it('should render error for invalid form submission', () => {
    const wrapper = shallow(<RegisterScreen  user={Users[1]}/>);
    expect(wrapper).toMatchSnapshot();
    wrapper.find('Form').simulate('submit', () => {
        preventDefault: () => { }
    });
    expect(wrapper.state('validated')).toEqual(false);
    expect(wrapper).toMatchSnapshot();
});