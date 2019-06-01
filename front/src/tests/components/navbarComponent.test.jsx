import NavbarComponent from '../../components/navbarComponent/navbarComponent';

it("should render correctly", () =>{
    const wrapper = shallow(
        <NavbarComponent />
    );
    expect(wrapper).toMatchSnapshot();
});

