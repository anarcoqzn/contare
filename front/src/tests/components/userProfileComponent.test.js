import UserProfile from '../../components/dasboardComponent/userProfileComponent/userProfileComponent.jsx';
import {shallowMount} from 'enzyme';
import index from '../../services/index';
describe('<userProfileComponent />', () => {
window.location = {reload: jest.fn()}
const login = jest.fn();
const getToken = jest.fn();


it('should render UserProfileComponent correctly', () => {
    const wrapper = shallow(<UserProfile token = {getToken}/>);
    console.log(wrapper.debug());
    expect(wrapper).toMatchSnapshot();
});


});


