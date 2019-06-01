import Page404Component from '../../components/page404Component/page404Component';

it("should render correctly", () =>{
    const wrapper = shallow(
        <Page404Component />
    );
    expect(wrapper).toMatchSnapshot();
});

